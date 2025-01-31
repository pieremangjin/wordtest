function giveTestDay(day) {
    //const day = document.querySelector(".day").innerText;
    localStorage.setItem('day', day);

    location.href = "explain.html";
}


function getTestDay() {
    let getDay = localStorage.getItem('day');
    document.querySelector(".testDay").innerText = getDay;
}

function loadList() {
    let loadDay = localStorage.getItem('day');

    //시험볼 영어 list
    let dayList = wordLists[loadDay];

    //한글 뜻 추출 list
    let dayList2 = wordLists2[loadDay];

    if (dayList.length === 0) {
        localStorage.setItem('wrongAnswerCount', wrongAnswerArr.length); // 오답 개수 저장
        localStorage.setItem('wrongAnswerList', JSON.stringify(wrongAnswerArr)); // 오답 리스트 저장
        location.href = "end.html";
        return;
    }

    return {
        dayList,
        dayList2,
    };
}

//전역변수선언(qword, answerword1,2,3,4)
let selectWord1
let correctAnswer;

function showWord(dayList, dayList2) {
    const randomIndex = Math.floor(Math.random() * dayList.length);

    selectWord1 = dayList[randomIndex];

    dayList.splice(randomIndex, 1);

    //question
    document.querySelector('.qWord').innerText = selectWord1[0];

    let selectWord2, selectWord3, selectWord4;
    let usedMeanings = new Set();

    usedMeanings.add(selectWord1[1]);
    function getUniqueWord() {
        let word;
        do {
            word = dayList2[Math.floor(Math.random() * dayList2.length)];
        } while (usedMeanings.has(word[1]));  // 같은 뜻이 나오지 않도록 검사
        usedMeanings.add(word[1]); // 뜻을 추가하여 중복 방지
        return word;
    }

    selectWord2 = getUniqueWord();
    selectWord3 = getUniqueWord();
    selectWord4 = getUniqueWord();

    //answersheet
    correctAnswer = selectWord1[1];
    let wrongAnswer1 = selectWord2[1];
    let wrongAnswer2 = selectWord3[1];
    let wrongAnswer3 = selectWord4[1];

    let answerarr = [correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3];

    answerarr.sort(() => Math.random() - 0.5);

    document.querySelector('.answer1').innerText = answerarr[0];
    document.querySelector('.answer2').innerText = answerarr[1];
    document.querySelector('.answer3').innerText = answerarr[2];
    document.querySelector('.answer4').innerText = answerarr[3];
}

function main() {
    const {
        dayList,
        dayList2,
    } = loadList();
    showWord(dayList, dayList2);
    count(dayList, dayList2);
}

//오답 리스트
let wrongAnswerArr = [];

function compare(event) {
    let selectedAnswer = event.target.innerText;

    if (selectedAnswer === correctAnswer) {
        document.querySelector('.qWord').style.backgroundColor = "#3EC5FF";
    } else {
        document.querySelector('.qWord').style.backgroundColor = "#FF3E3E";
        wrongAnswerArr.push(selectWord1);
    }
    setTimeout(() => {
        resetButtonColor();
        main();
    }, 1000);
}

function wrongCount() {
    let wrongCount = localStorage.getItem('wrongAnswerCount');
    document.querySelector('.wrongcount').innerText = wrongCount;
}
// Add event listeners to the answer buttons
document.querySelectorAll('#ans').forEach(button => {
    button.addEventListener('click', compare);
});

function showwrongList() {
    let wrongCountList = JSON.parse(localStorage.getItem('wrongAnswerList'));

    const listContainer = document.querySelector('.list_container');

    listContainer.innerHTML = '';

    let table;
    let wordContainer;
    let rowCount = 0;

    function createTable() {
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'word_row';

        table = document.createElement('table');
        table.className = 'word_table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const englishHeader = document.createElement('th');
        englishHeader.innerText = '영어단어';

        const koreanHeader = document.createElement('th');
        koreanHeader.innerText = '한글 뜻';

        headerRow.appendChild(englishHeader);
        headerRow.appendChild(koreanHeader);
        thead.append(headerRow);

        wordContainer = document.createElement('tbody');
        wordContainer.className = 'word_container';

        table.appendChild(thead);
        table.appendChild(wordContainer);

        tableWrapper.appendChild(table);
        listContainer.appendChild(tableWrapper);
    }

    createTable();

    for (let i = 0; i < wrongCountList.length; i++) {
        const wordPair = wrongCountList[i];

        // Create a table row
        const row = document.createElement('tr');

        //영어
        const englishWord = document.createElement('td');
        englishWord.innerText = wordPair[0]; // English word
        englishWord.className = 'english-word';

        //뜻
        const koreanWord = document.createElement('td');
        koreanWord.innerText = wordPair[1]; // Korean word
        koreanWord.className = 'korean-word';

        row.appendChild(englishWord);
        row.appendChild(koreanWord);

        wordContainer.appendChild(row);

        rowCount++;

        if (rowCount === 6) {
            createTable();
            rowCount = 0;
        }
    }
}


function resetButtonColor() {
    document.querySelectorAll('#ans').forEach(button => {
        button.style.backgroundColor = "";
    });
    const qButton = document.querySelector('.qWord')
    if (qButton) {
        qButton.style.backgroundColor = "";
    }
}

function count(dayList, dayList2) {
    //count
    let currentNum = dayList2.length - dayList.length;
    let totalNum = dayList2.length;
    document.querySelector('.current').innerText = currentNum;
    document.querySelector('.total').innerText = totalNum;
}