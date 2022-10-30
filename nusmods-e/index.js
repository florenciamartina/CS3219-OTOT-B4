const axios = require("axios");

module.exports = async function (context, req) {
  let ay = req.query.ay;

  const NUS_MODS_BASE_URL = `https://api.nusmods.com/v2/${ay}/moduleInfo.json`;

  const mods = await axios.get(NUS_MODS_BASE_URL, {
    responseType: "json",
  });

  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
    body: {
      modules: mods.data,
    },
  };
};
