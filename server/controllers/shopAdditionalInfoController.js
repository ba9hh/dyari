const ShopAdditionalInfo = require('../models/ShopAdditionalInfo');

exports.saveAdditionalInfo = async (req, res) => {
    const { shopId } = req.params;
    const raw = {
        facebook: req.body.facebook || "",
        instagram: req.body.instagram || "",
        tiktok: req.body.tiktok || "",
        youtube: req.body.youtube || "",
        whatsapp: req.body.whatsapp || "",
        locationExact: req.body.locationExact || ""
    };

    // Build $set and $unset objects
    const setOps = {};
    const unsetOps = {};
    for (const [key, val] of Object.entries(raw)) {
        if (val.trim() !== "") {
            setOps[key] = val.trim();
        } else {
            unsetOps[key] = "";            // mark for removal
        }
    }

    try {
        // If no fields to set and no existing doc → nothing to save
        const existing = await ShopAdditionalInfo.findOne({ shopId });
        if (!existing && Object.keys(setOps).length === 0) {
            return res
                .status(200)
                .json({ success: true, message: 'No additional info to save.' });
        }

        // If unsetting everything and nothing to set → delete doc
        if (existing && Object.keys(setOps).length === 0) {
            await existing.deleteOne();
            return res
                .status(200)
                .json({ success: true, message: 'All additional info cleared; record deleted.' });
        }

        // Upsert: update existing or create new
        const info = await ShopAdditionalInfo.findOneAndUpdate(
            { shopId },
            {
                ...(Object.keys(setOps).length && { $set: setOps }),
                ...(Object.keys(unsetOps).length && { $unset: unsetOps })
            },
            {
                new: true,   // return the updated doc
                upsert: true,   // create if missing
                setDefaultsOnInsert: true
            }
        ).lean();

        return res.status(200).json({ success: true, data: info });
    } catch (err) {
        console.error('Error saving additional info:', err);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getAdditionalInfo = async (req, res) => {
    const { shopId } = req.params;

    try {
        const info = await ShopAdditionalInfo.findOne({ shopId }).lean();
        if (!info) {
            return res.status(200).json({ success: true, data: {} });
        }
        return res.status(200).json({ success: true, data: info });
    } catch (err) {
        console.error('Error fetching additional info:', err);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.updateAdditionalInfo = async (req, res) => {
    const { shopId } = req.params;
    const updateData = req.body;

    try {
        const updatedInfo = await ShopAdditionalInfo.findOneAndUpdate(
            { shopId },
            { $set: { ...updateData, shopId } },
            { new: true, upsert: true }
        );

        return res.json(updatedInfo);
    } catch (err) {
        console.error('Failed to update additional info:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteAdditionalInfo = async (req, res) => {
    const { shopId } = req.params;
    const { field } = req.body; // The field name to delete

    try {
        const doc = await ShopAdditionalInfo.findOne({ shopId });

        if (!doc) {
            return res.status(404).json({ message: 'Additional info for that shop not found' });
        }

        const docObject = doc.toObject();

        // Exclude default Mongo fields from the count
        const keys = Object.keys(docObject).filter(
            key => !['_id', 'shopId', '__v'].includes(key)
        );

        if (!keys.includes(field)) {
            return res.status(400).json({ message: `Field '${field}' does not exist in document` });
        }

        if (keys.length === 1 && keys[0] === field) {
            // It's the only custom field, so delete the document
            await ShopAdditionalInfo.deleteOne({ shopId });
            return res.json({ message: `Field '${field}' was the only one, document deleted` });
        } else {
            // Remove the field from the document
            const updatedDoc = await ShopAdditionalInfo.findOneAndUpdate(
                { shopId },
                { $unset: { [field]: "" } },
                { new: true }
            );
            return res.json(updatedDoc);
        }
    } catch (err) {
        console.error('Failed to delete field from additional info:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};