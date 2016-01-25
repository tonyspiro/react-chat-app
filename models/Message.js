// models/Message.js
import Cosmic from 'cosmicjs'

export default {
  create: (config, params, callback) => {
    var object = {
      title: params.author + ': ' + params.message,
      type_slug: config.bucket.type_slug,
      metafields: [
        {
          title: 'Message',
          key: 'message',
          value: params.message,
          type: 'textarea',
          edit: 1
        },
        {
          title: 'Author',
          key: 'author',
          value: params.author,
          type: 'text',
          edit: 1
        }
      ],
      options: {
        slug_field: 0,
        content_editor: 0,
        add_metafields: 0,
        metafields_title: 0,
        metafields_key: 0
      }
    }
    Cosmic.addObject(config, object, (err, res) => {
      object = res.object
      const message = {
        _id: object._id,
        metafield: {
          message: {
            value: object.metafields[0].value
          },
          author: {
            value: object.metafields[1].value
          }
        }
      }
      callback(message)
    })
  }
}