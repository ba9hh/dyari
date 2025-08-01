const express = require("express");
const { saveAdditionalInfo, getAdditionalInfo, updateAdditionalInfo,deleteAdditionalInfo } = require("../controllers/shopAdditionalInfoController");
const router = express.Router();


router.get("/shop/:shopId/additional-info", getAdditionalInfo);
router.post("/shop/:shopId/additional-info", saveAdditionalInfo);
router.put('/shop/:shopId/additional-info',updateAdditionalInfo);
router.delete('/shop/:shopId/additional-info',deleteAdditionalInfo);
module.exports = router;