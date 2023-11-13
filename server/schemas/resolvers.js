const User = require("../models/User");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
        .select('-__v -password')
        .populate('savedBooks')
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({email});
      if (!user) {
        throw new AuthenticationError('Incorrect login details.');
      }

      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw new AuthenticationError('Incorrect login details.');
      };

      const authToken = signToken(user);
      return { authToken, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const authToken = signToken(user);
      return { authToken, user };
    },

    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
      }
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
      }
    }
  }
};

module.exports = resolvers;