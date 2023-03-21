const express = require("express");
const { Client } = require("pg");
const axios = require("axios")
const bodyParser = require("body-parser")
const cors = require("cors")
const dotenv = require("dotenv");


const app = express();
app.use(bodyParser.json());
app.use(cors())

dotenv.config();

// Define OpenAI endpoint
const endpoint = "https://api.openai.com/v1/engines/engine_id/jobs";

// Define base64 security function

app.get("/", (req, res) => {
  res.send("Hello Goodbye!");
})

app.post("/api/call-openai", async (req, res) => {
  try {
    // Check if daily limit has been reached
    
    const prompt = req.body.params;
    console.log("Second Call")
    axios
      .post(
        "https://api.openai.com/v1/completions",
        {
          prompt: prompt,
          max_tokens: 500,
          temperature: .1,
          model: "text-davinci-003",
          presence_penalty : 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + process.env.OPENAPI_AUTH,
          },
        }
      )
      .then((response) => {
        console.log("Third Call - REsponse")
        console.log(response.data.choices)
        res.send(response.data.choices);
        
      }).then((ress) => {
        console.log("Done. Removed Logging")

      })
      .finally((response) => {
        
      });
     
      
  } catch (error) {
    return res.status(500).send({ error: "An unexpected error occurred" });
  }
});

app.listen(3000, () => {
  console.log("API listening on port 3000");
});


function mysql_real_escape_string (str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
          case "\0":
              return "\\0";
          case "\x08":
              return "\\b";
          case "\x09":
              return "\\t";
          case "\x1a":
              return "\\z";
          case "\n":
              return "\\n";
          case "\r":
              return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
              return "\\"; // prepends a backslash to backslash, percent,
                                // and double/single quotes
          default:
              return char;
      }
  });
}