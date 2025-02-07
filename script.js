if (localStorage.length === 0) {
  /* 로컬스토리지에 데이터 저장 */
  localStorage.setItem('discussions', JSON.stringify(agoraStatesDiscussions)); 
};
/* 로컬스토리지에서 데이터 불러오기 */
let getStorageData = JSON.parse(localStorage.getItem('discussions')); 

const discussionWrapper = document.querySelector('.discussion__wrapper');
const ul = document.querySelector("ul.discussions__container");
const showContent = 10; 
let maxPage = Math.ceil(getStorageData.length / showContent);
let prevButtonNum = 1;

/* 포스트 정보 추가 */
const convertToDiscussion = (obj) => { 
  const li = document.createElement("li"); 
  li.className = "discussion__container";
  const avatarWrapper = document.createElement("div"); 
  avatarWrapper.className = "discussion__avatar--wrapper"; 
  const discussionContent = document.createElement("div"); 
  discussionContent.className = "discussion__content"; 
  const discussionAnswered = document.createElement("div"); 
  discussionAnswered.className = "discussion__answered";

  const avatarImg = document.createElement('img');
  avatarImg.setAttribute('src', obj.avatarUrl);
  avatarImg.setAttribute('alt', obj.author);
  avatarWrapper.appendChild(avatarImg);

  const contentH2 = document.createElement('h2');
  contentH2.className = "discussion__title";
  const contentA = document.createElement('a');
  contentA.setAttribute('href', obj.url);
  contentA.textContent = obj.title;
  contentH2.appendChild(contentA);
  discussionContent.appendChild(contentH2);

  const contentDiv = document.createElement('div');
  contentDiv.className = "discussion__information";
  contentDiv.textContent =`${obj.author} / ${new Date(obj.createdAt).toLocaleString('ko-KR').slice(-11)}`;
  discussionContent.appendChild(contentDiv);
 
  const answeredP = document.createElement('p');
  answeredP.textContent = obj.answer ? '☑' : '⊠';
  discussionAnswered.appendChild(answeredP);

  li.append(avatarWrapper, discussionContent, discussionAnswered);
  return li;
};

/* 새포스트 추가 */
const inputName = document.querySelector("#name");
const inputTitle = document.querySelector("#title");
const inputQuestion = document.querySelector("#story");
const submit = document.querySelector('#submit');

submit.onclick = (event) => {
  event.preventDefault();
  if (inputName.value && inputTitle.value && inputQuestion.value) {
    let confirmAnswer = window.confirm("질문을 추가하시겠습니까?");
    if (confirmAnswer === true) {
      const newInfo = {};
      newInfo.author = inputName.value,
      newInfo.title = inputTitle.value,
      newInfo.createdAt = new Date(),
      newInfo.bodyHTML = inputQuestion.value,
      newInfo.avatarUrl = "https://miro.medium.com/max/700/1*JyYin7G7aGwgD9zpYBZ12Q.png"
      getStorageData.unshift(newInfo);
      localStorage.setItem('discussions', JSON.stringify(getStorageData));

      inputName.value = "";
      inputTitle.value = "";
      inputQuestion.value = "";

      getStorageData = JSON.parse(localStorage.getItem('discussions')); 
      maxPage = Math.ceil(getStorageData.length / showContent);
      updatePostUI(1);
    } else {
      alert("제출을 취소하셨습니다.");
    }
  } else {
    window.alert("필수사항을 모두 입력해주세요.");
  };
};

/* 포스트 생성 */
const updatePostUI = (buttonNum) => { 
  prevButtonNum = Number(buttonNum);
  const ul = document.querySelector("ul.discussions__container"); 
  ul.parentNode.removeChild(ul);
  const newUL = document.createElement('ul');
  newUL.className= "discussions__container";
  let startNum = (showContent*buttonNum)-showContent;
  let endNum = (showContent*buttonNum)-1;

  if (Number(maxPage) === Number(buttonNum)) {
    endNum = getStorageData.length-1;
  };
  
  for (let i = startNum; i <= endNum; i += 1) {
    newUL.appendChild(convertToDiscussion(getStorageData[i])); 
  };
  discussionWrapper.prepend(newUL);
  showButton();
}

/* 버튼 추가 */
const showButton = () => { 
  const buttonlist = document.querySelector('.buttonlist');
  buttonlist.parentNode.removeChild(buttonlist);
  const pageDiv = document.createElement('div');
  pageDiv.className = 'buttonlist';
    
  for (let i = 0; i <= maxPage+1; i++) {
    const pageA = document.createElement('a');
    pageA.className = "pageButton";
    if (i === 0) {
      pageA.textContent = "<";
      pageA.onclick = (event) => {
        if (prevButtonNum === 1) {
          prevButtonNum = 1;
          updatePostUI(1);
        } else { 
          updatePostUI(prevButtonNum-1);
        };
      };
    } else if (i === maxPage+1) {
      pageA.textContent = ">";
      pageA.onclick = (event) => {
        if (prevButtonNum === maxPage) {
          prevButtonNum = maxPage;
          updatePostUI(maxPage);
        } else { 
          updatePostUI(prevButtonNum+1);
        };
      };
    } else {
      pageA.textContent = i;
      pageA.onclick = (event) => {
        updatePostUI(event.target.textContent);
      };
    };
    pageDiv.appendChild(pageA);
  };
  const pagination = document.querySelector('.pagination');
  pagination.prepend(pageDiv);
  document.querySelectorAll('.pageButton')[prevButtonNum].classList.add('active');
};

updatePostUI(1); 