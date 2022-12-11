export const processLayoutItems = (document: Document) => {
    const selectedItems = document.querySelectorAll(".item_row_flex");
      const selectedItemsArray = Array.from(selectedItems);
      const processedItems = selectedItemsArray.map((item) => {
        if (!item) {
          return;
        }
        const id = item.getAttribute("id");
        const title = item.querySelector(".li-title")?.textContent;
        const price = item.querySelector(".list_price")?.textContent;
        const link = item.getAttribute("href");
        const timestamp = item
          .querySelector(".date_image")
          ?.textContent?.split("\t")
          .join("")
          .split("\n")
          .join("");
        return { id, title, price, link, timestamp };
      });
      return processedItems;
}