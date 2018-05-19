module.exports = {
  compilerOptions: {
    format: 'es'
  },
  preprocess: {
    markup: ({ content }) => {

      content = content.replace('__REPLACE_ME__', 'world');

      return {
        code: content
      };
    },
  },
};