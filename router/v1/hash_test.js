import * as hashModule from "../../utils/hash.mjs";

const hashed = hashModule.createHash("a");
hashed
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

export function create(req, resp) {
  const result = hashModule.createHash(req.query.value);
  result
    .then((hashed) => {
      if (hashed.length < 1) {
        resp.json({ result: req.query.value });
      } else {
        resp.json({ result: hashed });
      }
    })
    .catch((e) => {
      console.log(e);
      resp.json({ result: req.query.value });
    });
}

export function compare(req, res) {
  const reqObj = req.query;

  if (reqObj.hash == undefined) {
    res.json({ result: "no hash" });
    return;
  }

  if (reqObj.password == undefined) {
    res.json({ result: "no password" });
    return;
  }
  const result = hashModule.compareHash(reqObj.password, reqObj.hash);
  result
    .then((result) => {
      if (result == true) {
        res.json({ result: "valid" });
      } else {
        res.json({ result: "invalid" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.json({ result: req.query });
    });
}
