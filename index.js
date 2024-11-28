import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });


// import { createApi } from "unsplash-js";
// import nodeFetch from "node-fetch";

//   const unsplash = createApi({
//     accessKey: "_ykRQuYxRgR_ZLcsb6C_qm3H_qv_2RJwomppwvWM1Rg",

//     fetch: nodeFetch,
//   });
// const getresult = async () => {
//   const result = await unsplash.search.getPhotos({
//     query: "black cats",

//     // page: 1,

//     perPage: 1,

//     // color: "green",

//     orientation: "portrait",
//   });

//   console.log(result.response.results.find(item => item.slug).slug);
// };

// getresult();