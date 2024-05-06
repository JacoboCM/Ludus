document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".wrapper");

  carousels.forEach((wrapper, index) => {
    const sections = [
      [
        "https://occ-0-1567-1123.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABRvngexxF8H1-OzRWFSj6ddD-aB93tTBP9kMNz3cIVfuIfLEP1E_0saiNAwOtrM6xSOXvoiSCMsihWSkW0dq808-R7_lBnr6WHbjkKBX6I3sD0uCcS8kSPbRjEDdG8CeeVXEAEV6spQ.webp",
        "https://occ-0-243-299.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABZEK-7pZ1H5FD4cTyUb9qB_KeyJGz5p-kfPhCFv4GU_3mbdm8Xfsy4IBchlG9PFNdGff8cBNPaeMra72VFnot41nt0y3e8RLgaVwwh3UvyM2H2_MkmadWbQUeGuf811K7-cxJJh7gA.jpg",
        "https://occ-0-243-299.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABbcCX42tsqGbBvO2y9CQv5-7QvYbCfoHtXsuc6NPCtZaKa4l4fBX3XWvUwG9F2A3CTsNpHVmulxBbdXKwK8Q6xGjejd9FoadGkZ7CnGrSl601TOQjzSHJ23NuIPC8j0QMGORL4uRIA.jpg",
        "https://occ-0-243-299.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABQCoK53qihwVPLRxPEDX98nyYpGbxgi5cc0ZOM4iHQu7KQvtgNyaNM5PsgI0vy5g3rLPZdjGCFr1EggrCPXpL77p2H08jV0tNEmIfs_e8KUfvBJ6Ay5nM4UM1dl-58xA6t1swmautOM.webp",
        "https://occ-0-243-299.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABdYtAqj8CyaJTWq5taD8Ro_UgwH3nne9QpFGVps-2J3IG-leqrfqXFii4jzZn48nPYTkrlwKQEV0R7_cEKlYBPRzdKqNODc-Oz26IL3LlLgFboXibIWXwxzeYxzuqn0I9TpARjeByw.jpg",
      ],
      [
        "https://occ-0-243-299.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABdYtAqj8CyaJTWq5taD8Ro_UgwH3nne9QpFGVps-2J3IG-leqrfqXFii4jzZn48nPYTkrlwKQEV0R7_cEKlYBPRzdKqNODc-Oz26IL3LlLgFboXibIWXwxzeYxzuqn0I9TpARjeByw.jpg",
        "https://occ-0-243-299.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABQCoK53qihwVPLRxPEDX98nyYpGbxgi5cc0ZOM4iHQu7KQvtgNyaNM5PsgI0vy5g3rLPZdjGCFr1EggrCPXpL77p2H08jV0tNEmIfs_e8KUfvBJ6Ay5nM4UM1dl-58xA6t1swmautOM.webp",
        "https://occ-0-243-299.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABZEK-7pZ1H5FD4cTyUb9qB_KeyJGz5p-kfPhCFv4GU_3mbdm8Xfsy4IBchlG9PFNdGff8cBNPaeMra72VFnot41nt0y3e8RLgaVwwh3UvyM2H2_MkmadWbQUeGuf811K7-cxJJh7gA.jpg",
        "https://occ-0-1567-1123.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABRvngexxF8H1-OzRWFSj6ddD-aB93tTBP9kMNz3cIVfuIfLEP1E_0saiNAwOtrM6xSOXvoiSCMsihWSkW0dq808-R7_lBnr6WHbjkKBX6I3sD0uCcS8kSPbRjEDdG8CeeVXEAEV6spQ.webp",
        "https://occ-0-243-299.1.nflxso.net/dnm/api/v5/rendition/412e4119fb212e3ca9f1add558e2e7fed42f8fb4/AAAABbcCX42tsqGbBvO2y9CQv5-7QvYbCfoHtXsuc6NPCtZaKa4l4fBX3XWvUwG9F2A3CTsNpHVmulxBbdXKwK8Q6xGjejd9FoadGkZ7CnGrSl601TOQjzSHJ23NuIPC8j0QMGORL4uRIA.jpg",
      ],
    ];

    // Shuffle images within each sections array
    sections.forEach((images) => {
      for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
      }
    });

    sections.forEach((images, sectionIndex) => {
      const section = document.createElement("section");
      section.id = `carousel${index + 1}-section${sectionIndex + 1}`;
      section.classList.add("carousel-section");
      wrapper.appendChild(section);

      images.forEach((imageUrl, imgIndex) => {
        const item = document.createElement("div");
        item.classList.add("item");
        section.appendChild(item);

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Carousel ${index + 1} Image ${sectionIndex + 1}-${
          imgIndex + 1
        }`;
        // Add onClick event to each image
        img.addEventListener("click", function () {
          window.location.href = "/pages/detailPage.html";
        });
        item.appendChild(img);
      });

      // Create arrow buttons inside each section
      const leftArrow = document.createElement("a");
      leftArrow.href = `#carousel${index + 1}-section${sectionIndex}`;
      leftArrow.classList.add("arrow__btn", "left-arrow");
      leftArrow.textContent = "‹";
      section.appendChild(leftArrow);

      const rightArrow = document.createElement("a");
      rightArrow.href = `#carousel${index + 1}-section${sectionIndex}`;
      rightArrow.classList.add("arrow__btn", "right-arrow");
      rightArrow.textContent = "›";
      section.appendChild(rightArrow);

      // Add event listeners to arrow buttons
      leftArrow.addEventListener("click", function (event) {
        event.preventDefault();
        const currentSection = this.parentElement.id;
        const currentIndex =
          parseInt(currentSection.split("-")[1].replace("section", "")) - 1;
        const nextIndex = currentIndex - 1;

        const nextSection = document.querySelector(
          `#${currentSection.split("-")[0]}-section${nextIndex + 1}`
        );
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      });

      rightArrow.addEventListener("click", function (event) {
        event.preventDefault();
        const currentSection = this.parentElement.id;
        const currentIndex =
          parseInt(currentSection.split("-")[1].replace("section", "")) - 1;
        const nextIndex = currentIndex + 1;

        const nextSection = document.querySelector(
          `#${currentSection.split("-")[0]}-section${nextIndex + 1}`
        );
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  });
});
