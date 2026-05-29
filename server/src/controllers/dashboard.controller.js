const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const dashboardService = require('../services/dashboard.service');

const getOverview = asyncHandler(async (req, res) => {
  const overview = await dashboardService.getOverview(req.user._id);
  ApiResponse.success(overview, 'Dashboard overview retrieved').send(res);
});

const getTrends = asyncHandler(async (req, res) => {
  const trends = await dashboardService.getTrends(req.user._id);
  ApiResponse.success(trends, 'Trends data retrieved').send(res);
});

module.exports = { getOverview, getTrends };
