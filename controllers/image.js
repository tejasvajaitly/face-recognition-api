const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key f67b0a578c3b4f89adf449a07e0ab750");


const handleClarifaiApiCall = (req, res) => {
  const {imageUrl} = req.body
  const PAT = 'a62a249dedd34f4dafed6678d31480c2';
  const USER_ID = 'neiljaitly';
  const APP_ID = 'my-first-application';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
  const IMAGE_URL = imageUrl;

  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + PAT);

  stub.PostModelOutputs(
      {
          user_app_id: {
              "user_id": USER_ID,
              "app_id": APP_ID
          },
          model_id: MODEL_ID,
          version_id: MODEL_VERSION_ID,
          inputs: [
              { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
          ]
      },
      metadata,
      (err, response) => {
          if (err) {
            res.status(400).res("Clarifai Servers are down right now, come back later!")
          }
          if (response.status.code !== 10000) {
              res.status(400).json("Post model outputs failed, status: " + response.status.description);
          }
          res.json(response.outputs[0].data.regions[0].region_info.bounding_box)
      }

  );
}


const handleImageEntries = (req, res, db) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImageEntries: handleImageEntries,
  handleClarifaiApiCall: handleClarifaiApiCall
};
