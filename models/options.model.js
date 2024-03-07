const mongoose = require('mongoose');

const OptionsDataSchema = new mongoose.Schema({
    tagId: String,
    options: [String],
    moduleId: String

}, {
    versionKey: false,
    timestamps: true
});

const OptionsDataModel = mongoose.model('OptionsData', OptionsDataSchema);

module.exports = OptionsDataModel;