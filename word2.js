document.addEventListener('DOMContentLoaded', function () { // HTML 로딩 후 실행
    let selectdayList = []; // 전역 변수로 선언
    let selectDays = '';

    function getTestDays(event) {
        selectDays = event.target.innerText;

        if (selectdayList.includes(selectDays)) {
            selectdayList = selectdayList.filter(day => day != selectDays);
            event.target.classList.remove('selected');
        } else {
            selectdayList.push(selectDays);
            event.target.classList.add('selected');
        }
    }

    function saveDays() {
        localStorage.setItem('selectedDay', JSON.stringify(selectdayList));
        setTimeout(() => {
            location.href = "select_mixed.html"; // 페이지 이동
        }, 100);
    }

    // day 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.day').forEach(button => {
        button.addEventListener('click', getTestDays);
    });

    // "다음" 버튼에 이벤트 리스너 추가
    const nextButton = document.querySelector('.next');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (selectdayList.length === 0) {
                alert("적어도 하나의 날짜를 선택하세요.");
                return; // 날짜가 선택되지 않으면 페이지 이동을 막음
            }

            saveDays(); // 선택된 날짜 저장
        });
    }
});


function showSelectDays() {
    let selectedDays = localStorage.getItem('selectedDay');
    selectedDays = JSON.parse(selectedDays);
    document.querySelector('.testDay').innerText = selectedDays.join(' ,')
}

let randomTestNum = 0;
let currentTestCount = 0;

function getrandomNum(event) {
    const testNum = event.target.innerText;
    let regex = testNum.replace(/[^0-9]/g, '');
    randomTestNum = parseInt(regex, 10); // 숫자로 변환하여 저장

    // randomTestNum을 localStorage에 저장
    localStorage.setItem('randomTestNum', randomTestNum);

    location.href = 'explain2.html'
}
// 모든 버튼에 이벤트 리스너 추가
const buttons = document.querySelectorAll('.randomcount');
buttons.forEach(button => {
    button.addEventListener('click', getrandomNum); // 버튼 클릭 시 getrandomNum 호출
});


let mergedTestList = [];
let mergedAnsList = [];
let selectWord1;
let correctAnswer;

let isLoaded = false;

function loadwordLists() {
    if (isLoaded) return;  // 이미 로드된 경우 실행하지 않음
    isLoaded = true;
    let selectedDays = localStorage.getItem('selectedDay');
    selectedDays = JSON.parse(selectedDays);

    let totaltestList = [];
    let totalansList = [];

    for (let i = 0; i < selectedDays.length; i++) {
        let dayList1 = wordLists[selectedDays[i]];
        let dayList2 = wordLists2[selectedDays[i]];

        totaltestList.push(dayList1);
        totalansList.push(dayList2);
    };

    // 병합 (전역 변수에 저장)
    mergedTestList = totaltestList.flat();
    mergedAnsList = totalansList.flat();
}

function showWord() {
    let repeatNum = localStorage.getItem('randomTestNum');

    if (currentTestCount >= repeatNum) {
        localStorage.setItem('wrongAnswerCount', wrongAnswerArr.length); // 오답 개수 저장
        localStorage.setItem('wrongAnswerList', JSON.stringify(wrongAnswerArr)); // 오답 리스트 저장
        location.href = "end2.html";
        return;
    }

    const randomIndex = Math.floor(Math.random() * mergedTestList.length);
    selectWord1 = mergedTestList[randomIndex];
    mergedTestList.splice(randomIndex, 1);


    // 문제 출제
    document.querySelector('.qWord').innerText = selectWord1[0];

    let selectWord2, selectWord3, selectWord4;
    let usedMeanings = new Set();

    usedMeanings.add(selectWord1[1]);

    function getUniqueWord() {
        let word;
        do {
            word = mergedAnsList[Math.floor(Math.random() * mergedAnsList.length)];
        } while (usedMeanings.has(word[1]));  // 같은 뜻이 나오지 않도록 검사
        usedMeanings.add(word[1]); // 뜻을 추가하여 중복 방지
        return word;
    }

    selectWord2 = getUniqueWord();
    selectWord3 = getUniqueWord();
    selectWord4 = getUniqueWord();

    // 정답 및 오답 설정
    correctAnswer = selectWord1[1];
    let wrongAnswer1 = selectWord2[1];
    let wrongAnswer2 = selectWord3[1];
    let wrongAnswer3 = selectWord4[1];

    let answerarr = [correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3];

    // 배열 섞기
    answerarr.sort(() => Math.random() - 0.5);

    // HTML 업데이트
    document.querySelector('.answer1').innerText = answerarr[0];
    document.querySelector('.answer2').innerText = answerarr[1];
    document.querySelector('.answer3').innerText = answerarr[2];
    document.querySelector('.answer4').innerText = answerarr[3];

    // 진행도 표시
    document.querySelector('.current').innerText = currentTestCount + 1;
    document.querySelector('.total').innerText = repeatNum;
    console.log(mergedTestList)
}

function main() {
    loadwordLists(); 
    showWord();
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
        currentTestCount++;
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