let store = Immutable.Map({
  user: Immutable.Map({
    name: "David",
  }),
  apod: "",
  rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
  roverData: "",
});

const updateStore = (store, newState) => {
  newStore = store.merge(newState);
  render(app, newStore);
};

//apod api
const getImageOfTheDay = (store) => {
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => {
      updateStore(store, { apod });
    })
    .catch((err) => console.log(err));
};

//rover api
const getRoverImage = (store) => {
  fetch(`http://localhost:3000/rovers/curiosity`)
    .then((res) => res.json())
    .then((roverData) => {
      updateStore(store, { roverData });
      console.log("clicked");
    })
    .catch((err) => console.log(err));
};
// dom elements
const app = document.getElementById("app");
const curiosityBtn = document.getElementById("curiosity");
const opportunityBtn = document.getElementById("opportunity");
const spiritBtn = document.getElementById("spirit");

const render = async (app, state) => {
  app.innerHTML = App(state);
};

// api call init
getImageOfTheDay(store);

//rover eventlistener
curiosityBtn.addEventListener("click", function () {
  getRoverImage(store);
});
opportunityBtn.addEventListener("click", function () {
  getRoverImage(store);
});
spiritBtn.addEventListener("click", function () {
  getRoverImage(store);
});

// ----------------COMPONENTS----------------------------

//greeting component
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

// create content
const App = (store) => {
  let user = store.get("user");
  return `
        <main>
            ${Greeting(user.get("name"))}
        </main>
        <section>
          <h3>NASA Mars Dashboard</h3>
            <p>
            One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
            the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
            This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
            applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
            explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
            but generally help with discoverability of relevant imagery.      
            </p>
        </section>
        <div id="apod">${ImageOfTheDay(store)}</div>
        <div id="rover">${ImageOfRover(store)}</div>
    `;
};

//apod image component
const ImageOfTheDay = (store) => {
  const apod = store.get("apod");
  if (apod.media_type === "video") {
    return `
          <p>See today's featured video <a href="${apod.get(
            "url"
          )}">here</a></p>
          <p>${apod.get("title")}</p>
          <p>${apod.get("explanation")}</p>
      `;
  } else {
    return `
    <img src="${apod.get("image").get("url")}" height="450px" width="100%" />
    <p>${apod.get("image").get("explanation")}</p>
      `;
  }
};

//image of rover
const ImageOfRover = (store) => {
  console.log("store", store);
  // return `
  // <img src="${roverData.data.photos.img_src}" height="450px" width="100%" />
  // `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(app, store);
});
