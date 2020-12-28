let store = Immutable.Map({
  user: Immutable.Map({
    name: "David",
  }),
  apod: Immutable.Map({ image: "" }),
  rovers: Immutable.List(["curiosity", "opportunity", "spirit"]),
  roverData: Immutable.Map({ data: "" }),
});

const updateStore = (store, newState) => {
  newStore = store.merge(newState);
  Object.assign(store, newStore);
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
const getRoverImage = (store, name) => {
  fetch(`http://localhost:3000/rovers/${name.textContent.toLowerCase()}`)
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
  getRoverImage(store, curiosity);
  window.scrollTo({ top: 1500, behavior: "smooth" });
});
opportunityBtn.addEventListener("click", function () {
  getRoverImage(store, opportunity);
  window.scrollTo({ top: 1500, behavior: "smooth" });
});
spiritBtn.addEventListener("click", function () {
  getRoverImage(store, spirit);
  window.scrollTo({ top: 1500, behavior: "smooth" });
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
        <h2>Rover Images</h2>
        <div id="board">${dashboard(store)}</div>
        <div id="rover">${ImageOfRover(store)}</div>
    `;
};

//apod image component
const ImageOfTheDay = (store) => {
  const apod = store.toJS().apod;

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
    ${apodImageEl(apod)}
      `;
  }
};

const apodImageEl = (apod) => {
  return ` 
  <img src="${apod.image.url}" width="100%" />
  <p>${apod.image.explanation}</p>
  `;
};

//image of rover
const ImageOfRover = (store) => {
  const roverData = store.toJS().roverData.data.photos;
  if (roverData === undefined || roverData === "") {
    return ``;
  } else {
    return `${roverData.map((el) => roverImageEl(el))}`;
  }
};

const dashboard = (store) => {
  const roverData = store.toJS().roverData.data.photos;
  if (roverData === undefined || roverData === "") {
    return `
    <div><b>landing date: </b></div>
    <div><b>launch date: </b></div>
    <div><b>earth-date: </b> </div>
    <div><b>status: </b> </div>
    `;
  } else {
    const data = {};
    roverData.map((el) => {
      data.landing = el.rover.landing_date;
      data.launch = el.rover.launch_date;
      data.earth = el.earth_date;
      data.status = el.rover.status;
    });

    return `
      <div class="block">
        <div><b>landing date: </b>${data.landing}</div>
        <div><b>launch date: </b>${data.launch}</div>
      </div>
      <div class="block">
        <div><b>earth-date: </b>${data.earth} </div>
        <div><b>status: </b> ${data.status}</div>
      </div>
    `;
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
  render(app, store);
});
