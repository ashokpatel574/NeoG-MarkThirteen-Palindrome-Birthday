"use strict";

const progressBar = document.querySelector(".progress-outer");
const resultContainer = document.querySelector(".result-container");
const resultOutput = document.querySelector(".result");
const resultText = document.querySelector(".result-container p");
const loadingContainer = document.querySelector(".loading");

const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let progressStartValue = 2;
  let progressEndValue = 60;
  loadingContainer.style.display = "block";
  resultContainer.style.display = "none";

  const dateInput = e.target[0].value;
  const [year, month, date] = dateInput.split("-");

  const hasPalindrome_birthdayResult = getDateFormat(
    date.toString(),
    month.toString(),
    year.toString()
  );

  resultOutput.innerText = "";
  resultText.innerText = "";

  const timer_progressBar = setInterval(() => {
    if (progressStartValue === progressEndValue) {
      clearTimeout(timer_progressBar);
      loadingContainer.style.display = "none";
      resultContainer.style.display = "block";
      resultContainer.scrollIntoView({ behavior: "smooth", bottom: 0 });

      if (hasPalindrome_birthdayResult) {
        resultOutput.innerText = `Yayy! Your birthday is palindrome in the format ${hasPalindrome_birthdayResult}.`;
        resultText.style.display = "none";
      } else {
        const palindromeDate = find_PalindromeDate(dateInput);

        resultOutput.innerText = `OOPS! Your birthday is not a palindrome.`;
        resultText.style.display = "block";

        resultText.innerText = ` The nearest palindrome is ${palindromeDate[0]} and you missed it by ${palindromeDate[1]} days.`;
      }
    }

    progressStartValue++;
    progressBar.style.background = `conic-gradient(#ffc727 ${
      progressStartValue * 6
    }deg, #ffff 0deg)`;
  }, 50);
});

////////

const getDateFormat = (date, month, year) => {
  if (date.length === 1) {
    date = "0" + date;
  }
  if (month.length === 1) {
    month = "0" + month;
  }

  const firstFormat = year + month + date;
  const secondFormat = month + date + year;
  const thirdFormat = date + month + year;

  if (checkPalindrome(firstFormat)) {
    return `${year}-${month}-${date}`;
  } else if (checkPalindrome(secondFormat)) {
    return `${month}-${date}-${year}`;
  } else if (checkPalindrome(thirdFormat)) {
    return `${date}-${month}-${year}`;
  } else {
    return null;
  }
};

function checkPalindrome(format) {
  if (format.toString().split("").reverse().join("") === format) {
    return true;
  }
}

function find_PalindromeDate(dateInput) {
  const dateValue = dateInput.split("-");

  let nextDate = Number(dateValue[2]);
  let nextMonth = Number(dateValue[1]);
  let nextYear = Number(dateValue[0]);

  let prevDate = Number(dateValue[2]);
  let prevMonth = Number(dateValue[1]);
  let prevYear = Number(dateValue[0]);

  let dayCount = 0;
  const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  while (true) {
    dayCount += 1;
    nextDate += 1;
    prevDate -= 1;

    if (nextDate > daysOfMonth[nextMonth - 1]) {
      nextDate = 1;
      nextMonth += 1;

      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;

        if (nextYear > 9999) {
          break;
        }
      }
    }

    if (prevDate < 1) {
      prevMonth -= 1;

      if (prevMonth < 1) {
        prevYear -= 1;

        if (prevYear < 1) {
          return ["", ""];
        } else {
          prevMonth = 12;
          prevDate = daysOfMonth[prevMonth - 1];
        }
      } else {
        prevDate = daysOfMonth[prevMonth - 1];
      }
    }

    const prevDate_palindrome = getDateFormat(
      prevDate.toString(),
      prevMonth.toString(),
      prevYear.toString()
    );

    if (prevDate_palindrome) {
      return [prevDate_palindrome, dayCount];
    }

    const nextDate_palindrome = getDateFormat(
      nextDate.toString(),
      nextMonth.toString(),
      nextYear.toString()
    );
    if (nextDate_palindrome) {
      return [nextDate_palindrome, dayCount];
    }
  }
}
