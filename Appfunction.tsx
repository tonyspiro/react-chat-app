import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import Cosmic from 'cosmicjs';
import io from 'socket.io-client';
import config from './config';
import { v1 as uuidv1 } from 'uuid';
import _ from 'lodash';
import { Input } from 'react-bootstrap';

interface Message {
    created: string;
    _id: string;
    metafield: {
        author: {
            value: string;
        };
        message: {
            value: string;
        };
    };
}

interface Data {
    author: string;
    messages: Message[];
}

const App = () => {
    // Component State
    const [data, setData] = useState<Data>({
        author: '',
        messages: [],
    });

    // Ref For Input Data
    const authorRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLInputElement>(null);
    const messagesScrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socket = io();

        const fetchData = async () => {
            let newData = data;

            // Check if the user focus on The input
            setTimeout(() => {
                if (authorRef.current) authorRef.current.focus();
            }, 100);

            const { objects } = await Cosmic.getObjects(config);

            const messages = objects?.type?.messages || [];
            messages.reverse();

            newData = {
                author: newData.author,
                messages,
            };

            setData(newData);

            socket.on('chat message', (message: Message) => {
                let updatedData = data;
                const updatedMessages = data.messages;
                if (updatedData.author !== message.metafield.author.value) {
                    updatedMessages.push(message);
                    updatedData = {
                        author: updatedData.author,
                        messages: updatedMessages,
                    };
                    setData(updatedData);
                }
            });
        };

        fetchData();

        return () => {
            // Disconnect the socket when the component is unmounted
            socket.disconnect();
        };
    }, [data.author, data.messages]);

    useEffect(() => {
        if (messageRef.current) messageRef.current.focus();
        if (messagesScrollAreaRef.current)
            messagesScrollAreaRef.current.scrollTop = messagesScrollAreaRef.current.scrollHeight;
    }, [data.messages]);

    const setAuthor = () => {
        const author = authorRef.current?.value.trim();
        if (!author) return;
        if (authorRef.current) authorRef.current.value = '';
        const messages = data.messages;
        setData({
            author,
            messages,
        });
    };

    const createMessage = () => {
        const newData = data;
        const messages = newData.messages;
        const socket = io();
        const messageText = messageRef.current?.value.trim();
        if (!messageText) return;

        const messageEmit = {
            message: messageText,
            author: newData.author,
        };

        socket.emit('chat message', messageEmit);

        const messageBrowser = {
            _id: uuidv1(),
            metafield: {
                author: {
                    value: newData.author,
                },
                message: {
                    value: messageText,
                },
            },
        };
        messages.push(messageBrowser);
        setData({
            author: newData.author,
            messages,
        });
        if (messageRef.current) messageRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newData = data;
        if (newData.author) createMessage();
        else setAuthor();
    };

    let formInput: JSX.Element;
    if (!data.author) {
        formInput = (
            <div>
                Hi, what is your name?
                <br />
                <Input type="text" ref={authorRef} />
            </div>
        );
    } else {
        formInput = (
            <div>
                Hello {data.author}, type a message:
                <br />
                <Input type="text" ref={messageRef} />
            </div>
        );
    }

    let messagesList: JSX.Element[] | null = null;
    if (data.messages) {
        const sortedMessages = _.sortBy(data.messages, (message) => {
            return message.created;
        });
        messagesList = sortedMessages.map((messageObject) => {
            if (messageObject) {
                return (
                    <li style={{ listStyle: 'none', marginBottom: '5px' }} key={messageObject._id}>
                        <b>{messageObject.metafield.author.value}</b>
                        <br />
                        {messageObject.metafield.message.value}
                    </li>
                );
            }
            return null;
        });
    }

    const scrollAreaStyle: React.CSSProperties = {
        height: window.innerHeight - 140,
        overflowY: 'scroll',
    };

    return (
        <div>
            <div style={{ paddingLeft: '15px' }}>
                <h2>React Chat App</h2>
                <div ref={messagesScrollAreaRef} style={scrollAreaStyle}>
                    <ul style={{ padding: '0' }}>{messagesList}</ul>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, width: '100%', paddingLeft: '15px', paddingRight: '15px' }}>
                <form onSubmit={handleSubmit}>{formInput}</form>
            </div>
        </div>
    );
};

const app = document.getElementById('app');
render(<App />, app);