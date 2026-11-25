import express from "express";
import { faker } from "@faker-js/faker";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/types", (req, res) => {
  res.render("types");
});

app.get("/spread", (req, res) => {
  res.render("spread");
});

app.get("/prevention", (req, res) => {
  res.render("prevention");
});

app.get("/alerts", (req, res) => {
  const alert = {
    title: faker.lorem.words(5),
    severity: faker.helpers.arrayElement([
      "Low",
      "Medium",
      "High",
      "Critical"
    ]),
    source: faker.internet.ipv4(),
    description: faker.lorem.sentence()
  };

  res.render("alerts", { alert });
});

app.get("/vulnerabilities", async (req, res) => {
  try {
    const apiUrl =
      "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("CISA API request failed");
    }

    const data = await response.json();

    res.render("vulnerabilities", {
      vulnerabilities: data.vulnerabilities.slice(-10).reverse(),
      catalogDate: data.dateReleased
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load cybersecurity data.");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});