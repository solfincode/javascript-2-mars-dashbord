let store = Immutable.Map({
  user: Immutable.Map({
    name: "David",
  }),
  apod: Immutable.Map({ image: "" }),
  rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
  roverData: Immutable.Map({ data: "" }),
});

const updateStore = (store, newState) => {
  store = store.merge(newState);
  render(app, store);
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
const getCuriosity = (store) => {
  fetch(`http://localhost:3000/rovers/curiosity`)
    .then((res) => res.json())
    .then((roverData) => {
      updateStore(store, { roverData });
    })
    .catch((err) => console.log(err));
};
const getOpportunity = (store) => {
  fetch(`http://localhost:3000/rovers/opportunity`)
    .then((res) => res.json())
    .then((roverData) => {
      updateStore(store, { roverData });
    })
    .catch((err) => console.log(err));
};

const getSpirit = (store) => {
  fetch(`http://localhost:3000/rovers/spirit`)
    .then((res) => res.json())
    .then((roverData) => {
      updateStore(store, { roverData });
    })
    .catch((err) => console.log(err));
};
// dom elements
const app = document.getElementById("app");

const render = async (app, state) => {
  app.innerHTML = App(state);
};

//rover eventlistener
const curiosityBtn = document.getElementById("curiosity");
const opportunityBtn = document.getElementById("opportunity");
const spiritBtn = document.getElementById("spirit");
curiosityBtn.addEventListener("click", function () {
  getCuriosity(store);
});
opportunityBtn.addEventListener("click", function () {
  getOpportunity(store);
});
spiritBtn.addEventListener("click", function () {
  getSpirit(store);
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
  let user = store.toJS();

  console.log("app", store);
  return `
        <main>
            ${Greeting(user.user.name)}
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
  // const apod = store.get("apod");
  const apod = store.toJS().apod;
  console.log("apod", apod.image.url);

  if (apod.media_type === "video") {
    return `
          <p>See today's featured video <a href="${apod.get(
            "url"
          )}">here</a></p>
          <p>${apod.title}</p>
          <p>${apod.explanation}</p>
      `;
  } else {
    return `
    <img src="${apod.image.url}" width="100%" />
    <p>${apod.image.explanation}</p>
      `;
  }
};

//image of rover
const ImageOfRover = (store) => {
  const roverData = store.toJS().roverData.data.photos;
  // const roverData = store.get("roverData").get("data").get("photos");
  console.log("inrover", roverData);
  if (roverData === undefined || roverData === "") {
    return ``;
  } else {
    return `${roverData.map((el) => roverImageEl(el))}`;
  }
};

const roverImageEl = (el) => {
  return `
          <div class="image-element">
            <img src="${el.img_src}" width="100%" />
          </div>
  `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  getImageOfTheDay(store);
  // render(app, store);
});
