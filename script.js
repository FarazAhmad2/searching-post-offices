document.addEventListener("DOMContentLoaded", () => {
  const ipAddress = document.querySelector("#wrapper .ip-address");
  const getStartedBtn = document.getElementById("get-started");
  const wrapper = document.getElementById("wrapper");

  function setEqualHeight() {
    var section1 = document.querySelector('.section-1');
    var section2 = document.querySelector('.section-2');
    section2.style.height = section1.offsetHeight + 'px';
  }

  window.onload = setEqualHeight;
  window.onresize = setEqualHeight;

  function getIPaddress() {
    wrapper.style.display = "flex";
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        ipAddress.textContent = data.ip;
        getInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  }

  getIPaddress();

  function getInfo(data) {
    getStartedBtn.addEventListener("click", () => {
      console.log("user's ip address:", data.ip);
      wrapper.style.display = "none";
      fetch(`https://ipapi.co/${data.ip}/json/`)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          populateData(result);
        });
    });
  }

  function populateData(data) {
    document.getElementById("main-content").style.display = "block";
    document.querySelector("#user-info .ip-address").textContent = data.ip;

    const userInfo = document.querySelector("#user-info .container");
    userInfo.innerHTML = `
                <p>Lat: <span class="user-info">${data.latitude}</span></p>
                <p>City: <span class="user-info">${data.city}</span></p>
                <p>Organisation: <span class="user-info">${data.org}</span></p>
                <p>Long: <span class="user-info">${data.longitude}</span></p>
                <p>Region: <span class="user-info">${data.region}</span></p>
                <p>Hostname: <span class="user-info">${data.hostname}</span></p>
    `;
    document.getElementById(
      "map"
    ).src = `https://maps.google.com/maps?q=${data.latitude}, ${data.longitude}&output=embed`;

    const dateAndTime = () => {
      return new Date().toLocaleString("en-US", {
        timezone: `${data.timezone}`,
      });
    };

    dateAndTime();

    document.getElementById("more-info").innerHTML = `
            <h1>More Information About You</h1>
            <P>Time Zone: <span class="pincodes">${data.timezone}</span></P>
            <P>Date And Time: <span class="pincodes">${dateAndTime()}</span></P>
            <P>Pincode: <span class="pincodes">${data.postal}</span></P>
            <P>Message: <span class="pincodes total-pins">Number of pincode(s) found:</span></P>
    `;

    let myArr = [];

    fetch(`https://api.postalpincode.in/pincode/${data.postal}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.querySelector(
          ".total-pins"
        ).textContent = `Number of pincode(s) found: ${data[0].PostOffice.length}`;
        myArr = data[0].PostOffice;
        populateCards(myArr);
      });

    function populateCards(PostOffice) {
      const cardContainer = document.querySelector(".card-container");
      cardContainer.innerHTML = "";
      PostOffice.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
                    <p>Name: <span class="card-data">${item.Name}</span></p>
                    <p>Branch Type: <span class="card-data">${item.BranchType}</span></p>
                    <p>Delivery Status: <span class="card-data">${item.DeliveryStatus}</span></p>
                    <p>District: <span class="card-data">${item.District}</span></p>
                    <p>Division: <span class="card-data">${item.Division}</span></p>
          `;
        cardContainer.appendChild(card);
      });
    }

    document.getElementById("search").addEventListener("input", performSearch);

    function performSearch() {
      const searchItem = document.getElementById("search").value.toLowerCase();
      let filterData = myArr.filter(
        (item) =>
          item.Name.toLowerCase().includes(searchItem) ||
          item.BranchType.toLowerCase().includes(searchItem)
      );

      populateCards(filterData);
    }
  }
});
