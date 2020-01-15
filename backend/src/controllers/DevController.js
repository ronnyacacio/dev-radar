const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store (req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, bio, avatar_url } = response.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = { 
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        
            dev = await Dev.create({
                github_username,
                name,
                bio,
                avatar_url,
                techs: techsArray,
                location
            });
        }
        return res.json(dev);
    },

    async update(req, res) {
        const { name, bio, avatar_url, techs, latitude, longitude } = req.body;

        const location = { 
            type: 'Point',
            coordinates: [longitude, latitude]
        };

        const techsArray = parseStringAsArray(techs);

        const devTemp = {
            name,
            bio,
            avatar_url,
            techs: techsArray,
            location
        }

        const dev = await Dev.findByIdAndUpdate(req.params._id, devTemp, { new: true });

        return res.json(dev);
    },

    async destroy(req, res) {
        await Dev.findByIdAndRemove(req.params._id);

        return res.send();

    }
} 