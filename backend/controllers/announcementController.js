const Announcement = require("../models/Announcement");

/* CREATE ANNOUNCEMENT */
exports.createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      message,
      targetType,
      state,
      district,
      location,
      geo,
    } = req.body;

    const newAnnouncement = new Announcement({
      title,
      message,
      department: req.user.department,
      targetType,
      state,
      district,
      location,
      geo:
        targetType === "geo"
          ? {
              type: "Point",
              coordinates: [geo.lng, geo.lat],
              radiusKm: geo.radiusKm,
            }
          : undefined,
      createdBy: req.user.id,
    });

    await newAnnouncement.save();

    res.status(201).json({
      message: "Announcement created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET ANNOUNCEMENTS FOR CITIZEN */
exports.getAnnouncements = async (req, res) => {
  try {
    const { state, district, location, lat, lng } = req.query;

    const announcements = await Announcement.find({
      $or: [
        { targetType: "state", state },
        { targetType: "district", state, district },
        { targetType: "location", state, district, location },
        {
          targetType: "geo",
          geo: {
            $geoWithin: {
              $centerSphere: [
                [parseFloat(lng), parseFloat(lat)],
                10 / 6378.1, // 10km default radius
              ],
            },
          },
        },
      ],
    }).sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};