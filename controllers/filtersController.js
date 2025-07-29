const Listing = require('../models/listing');

module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;

    // Match DB entry: If DB has 'Farms', not 'farms'
    const normalized = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    try {
        const listings = await Listing.find({ category: normalized });
        res.render('listings/index', { listings, category: category.toLowerCase() });
    } catch (err) {
        console.error("Error filtering listings:", err);
        res.status(500).send("Something went wrong");
    }
};
