const axios = require("axios");

module.exports = async function (context, req) {
  let ay = req.query.ay;
  let page = req.query.page;
  const LIMIT = 20;
  const { dep, fac, mc, sem } = req.query;
  if (!ay) {
    ay = "2022-2023";
  }

  if (!page) {
    page = 1;
  }

  const start = (page - 1) * LIMIT;
  const end = start + LIMIT;

  const NUS_MODS_BASE_URL = `https://api.nusmods.com/v2/${ay}/moduleInfo.json`;

  const mods = await axios.get(NUS_MODS_BASE_URL, {
    responseType: "json",
  });

  // const listOfDep = [...new Set(mods.data.map((mod) => mod["department"]))];
  // const listOfFac = [...new Set(mods.data.map((mod) => mod["faculty"]))];
  // const listOfMc = [...new Set(mods.data.map((mod) => mod["moduleCredit"]))];
  //   console.log(listOfDep);
  //   console.log(listOfFac);
  //   console.log(listOfMc);

  const filteredSem = sem
    ? mods.data.filter((mod) =>
        mod["semesterData"].some(
          (semData) => semData["semester"] == parseInt(sem)
        )
      )
    : mods.data;
  const filteredDepartment = dep
    ? filteredSem.filter((mod) => mod["department"] == dep)
    : filteredSem;
  const filteredFaculty = fac
    ? filteredDepartment.filter((mod) => mod["faculty"] == fac)
    : filteredDepartment;
  const filteredMC = mc
    ? filteredFaculty.filter((mod) => mod["moduleCredit"] == mc)
    : filteredFaculty;
  const maxPage = Math.ceil(filteredMC.length / LIMIT);
  const limitedMods = filteredMC.slice(start, end);

  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
    body: {
      message: "Success",
      modules: limitedMods,
      maxPage: maxPage,
    },
  };
};
