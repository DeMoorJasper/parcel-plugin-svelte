// This is mainly to showcase config functionality and structure
module.exports = {
  compilerOptions: {
    generate: 'dom',
    format: 'cjs',
    store: true
  },
  preprocess: {
    markup: ({ content }) => {
      return {
        code: content,
        map: {}
      };
    },
  
    style: ({ content, attributes }) => {
      return {
        code: content,
        map: {}
      };
    },
  
    script: ({ content, attributes }) => {
      return {
        code: content,
        map: {}
      };
    }
  }
};