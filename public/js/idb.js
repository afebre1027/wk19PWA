let dataBase;
const request = indexedDB.open("budgetApp", 1);

request.onupgradeneeded = (e) => {
  let db = e.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = (e) => {
  dataBase = e.target.result;
  if (navigator.onLine) {
    addToDateBase();
  }
};

request.onerror = (e) => {
  console.log("this is the error", e.target.errorCode);
};

function addToDateBase() {
  const transactionList = dataBase.transaction(["pending"], "readwrite");
  const store = transactionList.objectStore("pending");
  const getAllTransactions = store.getAll();

  getAllTransactions.onsuccess = function () {
    if (getAllTransactions.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAllTransactions.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transactionList = dataBase.transaction(
            ["pending"],
            "readwrite"
          );
          const store = transactionList.objectStore("pending");
          store.clear();
        });
    }
  };
}

function saveRecord(t) {
  const transactionList = dataBase.transaction(["pending"], "readwrite");
  const store = transactionList.objectStore("pending");
  store.add(t);
}

window.addEventListener("onLine", addToDateBase);
