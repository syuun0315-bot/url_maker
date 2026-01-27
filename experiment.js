// 실험 데이터 저장 객체
const experimentData = {
    participantId: null,
    condition: null, // 1, 2, 3, 4
    startTime: null,
    stageTimes: {},
    learning: {
        startTime: null,
        endTime: null,
        duration: 0
    },
    review: {
        startTime: null,
        endTime: null,
        duration: 0,
        notes: null,
        questions: null,
        chatMessages: []
    },
    survey: {
        startTime: null,
        endTime: null,
        duration: 0,
        answers: {}
    },
    distractor: {
        startTime: null,
        endTime: null,
        duration: 0,
        problems: [],
        correctCount: 0,
        totalCount: 0
    },
    finalTest: {
        startTime: null,
        endTime: null,
        duration: 0,
        answers: {},
        questions: [] // 문제 목록
    },
    postSurvey: {
        startTime: null,
        endTime: null,
        duration: 0,
        answers: {}
    }
};

// 최종 테스트 문제 목록
const finalTestQuestions = [
    { number: 1, question: "박쥐의 종류는 큰 박쥐류와 작은 박쥐류로 나뉩니다. 이중 작은 박쥐류는 전 세계에 서식하고 있습니다. 큰 박쥐류의 주요 서식지는 어디입니까?" },
    { number: 2, question: "미국 텍사스 주에 있는 브랙큰 동굴(Bracken Cave)에는 약 2천만 마리가 넘는 멕시코 큰귀박쥐(Mexican free-tail bats)가 살고 있습니다. 이 박쥐들은 보통 하룻밤에 몇 톤의 곤충을 먹어치웁니까?" },
    { number: 3, question: "어떤 박쥐들은 먹잇감을 찾기 위해 반향정위(echolocation)라는 능력을 사용합니다. 반향정위는 무엇이며, 이를 이용하여 박쥐는 어떻게 물체의 거리와 크기를 분별할 수 있는지 구체적으로 설명해보세요." },
    { number: 4, question: "박쥐들은 특별히 발달된 발톱을 사용하여 천장에 거꾸로 매달립니다. 박쥐가 발톱으로 거꾸로 매달릴 수 있는 이유를 구체적으로 설명해보세요." },
    { number: 5, question: "전 세계에는 5,500 종의 포유류가 있습니다. 박쥐 종은 모든 포유류 종의 대략 몇 퍼센트를 차지합니까?" },
    { number: 6, question: "특이하게도, 박쥐는 거꾸로 자고 있을 때가 아니라 밤에 날아다닐 때 다른 동물의 공격을 종종 받습니다. 주로 어떤 동물이 박쥐를 공격해 먹이로 삼을까요?" },
    { number: 7, question: "새보다 박쥐가 모기를 더 잘 잡습니다. 박쥐가 날아다니는 작은 곤충을 사냥하는 데 새보다 더 능숙한 이유는 무엇일까요?" },
    { number: 8, question: "많은 동물학자의 의견에 따르면, 자연선택(natural selection, 자연에 잘 적응하여 선택된 개체가 살아남아 진화한다는 가설)으로 인해 박쥐가 일시적으로 반수면 상태에 빠지는 능력을 갖추게 되었습니다. 이러한 능력이 발달하게 된 배경은 특히 먹이 소비(food consumption)와 관련 있다고 보고 있습니다. 먹이 소비를 고려해봤을 때, 박쥐가 일시적으로 반수면 상태에 빠지는 이유는 무엇일까요?" },
    { number: 9, question: "미군은 박쥐의 날개를 모델로 한 새로운 항공기를 개발 중입니다. 이 새로운 유형의 항공기는 전투기와 같은 기존 항공기와 어떤 점이 다를까요?" },
    { number: 10, question: "박쥐가 반향정위(echolocation)를 사용하여 밤 비행을 하는 것처럼, 잠수함도 소나(sonar, 수중 음향 탐지기)라는 기술을 사용하여 깊은 물 속을 항해합니다. 소나를 이용할 때, 움직이는 물체가 잠수함에 다가오는지를(혹은 멀어짐) 어떻게 파악할 수 있을까요?" },
    { number: 11, question: "어센더(ascender, 고정된 로프를 타고 오르기 위해 사용되는 기계)는 암벽등반 시 사용하는 기계로 박쥐의 발톱과 비슷한 기능을 합니다. 어센더를 이용해 등반가가 밧줄을 타고 오르는 상황에서 어센더의 주요 기능과 작동 원리를 구체적으로 설명해보세요." },
    { number: 12, question: "일부 과학자들은 계절성 우울증(seasonal affective disorder, 계절적인 흐름을 타는 우울증)과 일부 동물(예: 박쥐)이 반수면 상태에 빠지는 현상이 비슷하다고 주장합니다. 계절성 우울증의 주요 증상이 식욕을 잃는 것임을 고려해볼 때, 이러한 증상이 과학자들의 가설을 뒷받침하는 이유는 무엇일까요?" }
];

// 현재 단계
let currentStage = 'start';
let timers = {};

// 조건 랜덤 배정 (1-4)
function assignCondition() {
    const condition = Math.floor(Math.random() * 4) + 1;
    experimentData.condition = condition;
    // 참가자 ID는 시작 화면에서 입력받음
    experimentData.startTime = new Date().toISOString();
    return condition;
}

// 단계 전환
function showStage(stage) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(stage + '-screen');
    if (targetScreen) {
        // 스크롤을 맨 위로 이동
        targetScreen.scrollTop = 0;
        window.scrollTo(0, 0);
        
        targetScreen.classList.add('active');
        currentStage = stage;
        
        // 각 단계별 초기화
        if (stage === 'review') {
            setupReviewStage();
        } else if (stage === 'survey') {
            setTimeout(() => {
                setupSurvey();
            }, 100);
        } else if (stage === 'distractor') {
            // distractor는 setupDistractorTask에서 처리하되, showStage는 이미 호출되었으므로
            // setupDistractorTask 내부에서 showStage를 호출하지 않도록 수정
            setTimeout(() => {
                setupDistractorTaskInternal();
            }, 50);
        }
        
        // 시간 기록
        if (!experimentData.stageTimes[stage]) {
            experimentData.stageTimes[stage] = {
                startTime: new Date().toISOString()
            };
        }
        
        // 설계자 모드일 때 정보 업데이트
        if (designerMode) {
            updateActiveNavButton();
            updateDesignerInfo();
        }
    }
}

// 복습 단계 설정
function setupReviewStage() {
    const condition = experimentData.condition;
    const reviewLeft = document.querySelector('.review-left');
    const reviewCenter = document.querySelector('.review-center');
    const reviewRight = document.querySelector('.review-right');
    
    // 모든 모드 숨기기
    document.getElementById('relearning-mode').style.display = 'none';
    document.getElementById('question-generation-mode').style.display = 'none';
    document.getElementById('ai-chat-mode').style.display = 'none';
    
    // review-center 초기화
    if (reviewCenter) {
        reviewCenter.classList.remove('hidden');
    }
    
    // 모든 모드 초기화
    const notesTextarea = document.getElementById('relearning-notes');
    const aiChatMode = document.getElementById('ai-chat-mode');
    const questionMode = document.getElementById('question-generation-mode');
    
    // 학습노트는 기본적으로 표시
    if (notesTextarea) {
        notesTextarea.style.display = '';
    }
    
    // order 초기화
    if (aiChatMode) {
        aiChatMode.style.order = '';
    }
    if (questionMode) {
        questionMode.style.order = '';
    }
    
    // 헤더 제목 초기화 (복습 단계로)
    const reviewHeader = document.querySelector('#review-screen .header h2');
    if (reviewHeader) {
        reviewHeader.textContent = '복습 단계';
    }
    
    // 레이아웃 스타일 초기화
    const reviewLayout = document.querySelector('.review-layout');
    if (reviewLayout) {
        reviewLayout.classList.remove('learning-style');
    }
    
    const reviewLeftEl = document.querySelector('.review-left');
    if (reviewLeftEl) {
        reviewLeftEl.classList.remove('content-area-style', 'full-width');
    }
    
    // review-center 초기화
    if (reviewCenter) {
        reviewCenter.classList.remove('hidden');
    }
    
    // 조건 클래스 초기화
    const reviewScreen = document.getElementById('review-screen');
    if (reviewScreen) {
        reviewScreen.classList.remove('condition-4');
    }
    
    // 조건에 따라 모드 표시
    if (condition === 1) {
        // 지문 재학습 - 처음 학습 화면과 똑같이 (지문만 전체 화면)
        if (reviewCenter) {
            reviewCenter.classList.add('hidden');
        }
        reviewRight.classList.add('hidden');
        reviewLeft.classList.add('full-width');
        
        // 헤더 제목은 "복습 단계"로 유지 (모든 조건 통일)
        
        // review-layout을 content-area 스타일로 변경
        const reviewLayout = document.querySelector('.review-layout');
        if (reviewLayout) {
            reviewLayout.classList.add('learning-style');
        }
        
        // review-left를 content-area처럼 보이도록
        const reviewLeftEl = document.querySelector('.review-left');
        if (reviewLeftEl) {
            reviewLeftEl.classList.add('content-area-style');
        }
    } else if (condition === 2) {
        // 지문 질문생성
        if (reviewCenter) {
            reviewCenter.classList.add('hidden');
        }
        reviewRight.classList.remove('hidden');
        reviewLeft.classList.remove('full-width');
        if (questionMode) {
            questionMode.style.display = 'block';
        }
    } else if (condition === 3) {
        // 지문+AI 재학습: 왼쪽엔 지문, 가운데엔 AI 챗봇만 표시
        if (reviewCenter) {
            reviewCenter.classList.remove('hidden');
        }
        reviewRight.classList.add('hidden');
        reviewLeft.classList.remove('full-width');
        // 재학습 모드는 숨기기
        if (document.getElementById('relearning-mode')) {
            document.getElementById('relearning-mode').style.display = 'none';
        }
        // AI 챗봇만 표시
        if (aiChatMode) {
            aiChatMode.style.display = 'block';
            // 챗봇 메시지 영역 초기화
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                chatMessages.innerHTML = '';
                // 환영 메시지 추가
                const welcomeMsg = document.createElement('div');
                welcomeMsg.className = 'chat-message ai';
                welcomeMsg.textContent = '안녕하세요! 박쥐에 관한 학습 지문에 대해 질문해주세요. 도움을 드리겠습니다.';
                chatMessages.appendChild(welcomeMsg);
            }
        }
    } else if (condition === 4) {
        // 지문+AI 질문생성: 세로로 3분할 (지문, 챗봇, 질문생성)
        // 조건 4 클래스 추가하여 화면을 넓게 사용
        const reviewScreen = document.getElementById('review-screen');
        if (reviewScreen) {
            reviewScreen.classList.add('condition-4');
        }
        
        if (reviewCenter) {
            reviewCenter.classList.remove('hidden');
        }
        reviewRight.classList.remove('hidden');
        reviewLeft.classList.remove('full-width');
        if (aiChatMode) {
            aiChatMode.style.display = 'block';
            // 챗봇 메시지 영역 초기화
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages && chatMessages.children.length === 0) {
                // 환영 메시지 추가
                const welcomeMsg = document.createElement('div');
                welcomeMsg.className = 'chat-message ai';
                welcomeMsg.textContent = '안녕하세요! 박쥐에 관한 학습 지문에 대해 질문해주세요. 도움을 드리겠습니다.';
                chatMessages.appendChild(welcomeMsg);
            }
        }
        if (questionMode) {
            questionMode.style.display = 'block';
        }
    }
    
    experimentData.review.startTime = new Date().toISOString();
}

// 최종 테스트 관련 변수
let currentQuestionIndex = 0;
let testQuestionTimers = {}; // 각 문제를 이미 본 적이 있는지 저장
let nextButtonTimers = {}; // 다음 버튼 표시 타이머

// 최종 테스트 설정
function setupFinalTest() {
    const container = document.getElementById('test-questions-container');
    if (!container) return;
    
    // 기존 내용 제거 및 초기화
    container.innerHTML = '';
    currentQuestionIndex = 0;
    testQuestionTimers = {};
    // 기존 타이머 모두 제거
    Object.values(nextButtonTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
    });
    nextButtonTimers = {};
    // 기존 타이머 모두 제거
    Object.values(nextButtonTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
    });
    nextButtonTimers = {};
    
    // 문제가 없으면 기본 12개 생성
    let questions = finalTestQuestions;
    if (questions.length === 0) {
        questions = Array.from({ length: 12 }, (_, i) => ({
            number: i + 1,
            question: `문제 ${i + 1} (문제 내용을 추가해주세요)`
        }));
    }
    
    // 모든 문제 생성 (숨김 처리)
    questions.forEach((q) => {
        const testItem = document.createElement('div');
        testItem.className = 'test-item';
        testItem.id = `test-item-${q.number}`;
        testItem.style.display = 'none';
        testItem.innerHTML = `
            <label>${q.number}. ${q.question}</label>
            <textarea id="test-q${q.number}" rows="5" placeholder="답변을 입력해주세요..."></textarea>
        `;
        container.appendChild(testItem);
    });
    
    experimentData.finalTest.questions = questions;
    
    // 첫 번째 문제 표시
    showQuestion(0);
}

// 특정 문제 표시
function showQuestion(index) {
    const questions = experimentData.finalTest.questions || finalTestQuestions;
    if (index < 0 || index >= questions.length) return;
    
    // 모든 문제 숨기기
    questions.forEach((q) => {
        const item = document.getElementById(`test-item-${q.number}`);
        if (item) {
            item.style.display = 'none';
        }
    });
    
    // 현재 문제 표시
    const currentQ = questions[index];
    const currentItem = document.getElementById(`test-item-${currentQ.number}`);
    if (currentItem) {
        currentItem.style.display = 'block';
        currentQuestionIndex = index;
        
        // 진행 상황 업데이트
        const progressEl = document.getElementById('test-progress');
        if (progressEl) {
            progressEl.textContent = `문제 ${index + 1} / ${questions.length}`;
        }
        
        // 네비게이션 버튼 업데이트
        const nextBtn = document.getElementById('test-next-btn');
        const submitBtn = document.getElementById('final-test-submit-btn');
        
        // 다음 버튼과 제출 버튼 처리
        if (index < questions.length - 1) {
            // 마지막 문제가 아닌 경우
            if (nextBtn) {
                // 기존 타이머가 있으면 제거
                if (nextButtonTimers[index]) {
                    clearTimeout(nextButtonTimers[index]);
                    delete nextButtonTimers[index];
                }
                
                // 이미 이 문제를 본 적이 있으면 즉시 표시, 아니면 10초 후 표시
                if (testQuestionTimers[currentQ.number]) {
                    nextBtn.style.display = 'inline-block';
                    nextBtn.disabled = false;
                } else {
                    // 다음 버튼을 처음에는 숨김
                    nextBtn.style.display = 'none';
                    nextBtn.disabled = true;
                    
                    // 10초 후 다음 버튼 표시
                    nextButtonTimers[index] = setTimeout(() => {
                        if (nextBtn) {
                            nextBtn.style.display = 'inline-block';
                            nextBtn.disabled = false;
                        }
                        testQuestionTimers[currentQ.number] = true;
                    }, 10000);
                }
            }
            if (submitBtn) {
                submitBtn.style.display = 'none';
            }
        } else {
            // 마지막 문제인 경우
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }
            if (submitBtn) {
                // 기존 타이머가 있으면 제거
                if (nextButtonTimers[index]) {
                    clearTimeout(nextButtonTimers[index]);
                    delete nextButtonTimers[index];
                }
                
                // 이미 이 문제를 본 적이 있으면 즉시 표시, 아니면 10초 후 표시
                if (testQuestionTimers[currentQ.number]) {
                    submitBtn.style.display = 'inline-block';
                    submitBtn.disabled = false;
                } else {
                    // 제출 버튼을 처음에는 숨김
                    submitBtn.style.display = 'none';
                    submitBtn.disabled = true;
                    
                    // 10초 후 제출 버튼 표시
                    nextButtonTimers[index] = setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.style.display = 'inline-block';
                            submitBtn.disabled = false;
                        }
                        testQuestionTimers[currentQ.number] = true;
                    }, 10000);
                }
            }
        }
        
        // 답변 입력은 언제든 가능 (즉시 활성화)
        const answerInput = document.getElementById(`test-q${currentQ.number}`);
        if (answerInput) {
            answerInput.disabled = false;
        }
    }
}

// 사후질문 관련 변수
let currentPostSurveyIndex = 0;
let currentSurveyIndex = 0;

// 설문 설정
function setupSurvey() {
    const container = document.getElementById('survey-questions-container');
    if (!container) {
        console.error('survey-questions-container를 찾을 수 없습니다.');
        return;
    }
    
    // 기존 내용 제거 및 초기화
    container.innerHTML = '';
    currentSurveyIndex = 0;
    
    // 설문 질문 목록
    const surveyQuestions = [
        {
            number: 1,
            type: 'scale',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '오늘 학습한 내용을 공부하는 것이 재밌었다.',
            scale: {
                min: 1,
                max: 7,
                minLabel: '전혀 동의하지 않음',
                maxLabel: '매우 그렇다'
            }
        },
        {
            number: 2,
            type: 'scale',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '앞으로도 오늘과 같은 방식으로 공부하고 싶다.',
            scale: {
                min: 1,
                max: 7,
                minLabel: '전혀 동의하지 않음',
                maxLabel: '매우 그렇다'
            }
        },
        {
            number: 3,
            type: 'scale',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '오늘 학습한 내용에 대해 더 알고 싶어졌다.',
            scale: {
                min: 1,
                max: 7,
                minLabel: '전혀 동의하지 않음',
                maxLabel: '매우 그렇다'
            }
        },
        {
            number: 4,
            type: 'scale',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '오늘 학습한 내용이 나에게 유용했다.',
            scale: {
                min: 1,
                max: 7,
                minLabel: '전혀 동의하지 않음',
                maxLabel: '매우 그렇다'
            }
        },
        {
            number: 5,
            type: 'scale',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '학습 활동을 하는 동안 스트레스를 느꼈다.',
            scale: {
                min: 1,
                max: 7,
                minLabel: '전혀 동의하지 않음',
                maxLabel: '매우 그렇다'
            }
        },
        {
            number: 6,
            type: 'scale',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '이 학습 과제를 수행하는 데 얼마나 많은 정신적 노력을 기울였습니까?',
            scale: {
                min: 1,
                max: 7,
                minLabel: '매우 낮은 정신적 노력을 들였다',
                maxLabel: '매우 높은 정신적 노력을 들였다'
            }
        },
        {
            number: 7,
            type: 'scale',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '이 학습 과제를 수행하는 것은 얼마나 어렵다고 느꼈습니까?',
            scale: {
                min: 1,
                max: 7,
                minLabel: '전혀 어렵지 않았다',
                maxLabel: '매우 어려웠다'
            }
        },
        {
            number: 8,
            type: 'number',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '오늘 학습한 내용을 얼마나 잘 이해했다고 느끼나요?',
            subtitle: '0~100 사이에서 선택해주세요.',
            min: 0,
            max: 100
        },
        {
            number: 9,
            type: 'number',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요.',
            question: '잠시 후, 방금 읽은 지문에 대한 최종 시험을 보게 됩니다. 지금 상태에서 문제를 푼다면 얼마나 맞힐 것 같나요?',
            subtitle: '0~100점까지 가장 솔직하게 떠오르는 점수를 입력해 주세요.',
            min: 0,
            max: 100
        }
    ];
    
    // 모든 질문 생성 (숨김 처리)
    surveyQuestions.forEach((q) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'post-survey-item';
        questionItem.id = `survey-item-${q.number}`;
        questionItem.style.display = 'none';
        
        let questionHTML = `
            <div class="post-survey-instruction">${q.instruction}</div>
            <div class="post-survey-question">${q.question}</div>
        `;
        
        if (q.subtitle) {
            questionHTML += `<div class="post-survey-subtitle">${q.subtitle}</div>`;
        }
        
        if (q.type === 'scale') {
            questionHTML += `
                <div class="scale-container">
                    <div class="scale-labels">
                        <span class="scale-min">${q.scale.minLabel}</span>
                        <span class="scale-max">${q.scale.maxLabel}</span>
                    </div>
                    <div class="scale-options">
            `;
            for (let i = q.scale.min; i <= q.scale.max; i++) {
                questionHTML += `
                    <label class="scale-option">
                        <input type="radio" name="survey-q${q.number}" value="${i}">
                        <span>${i}</span>
                    </label>
                `;
            }
            questionHTML += `
                    </div>
                </div>
            `;
        } else if (q.type === 'number') {
            // 8번은 단위 없음, 9번은 '점'
            const unit = q.number === 8 ? '' : (q.number === 9 ? '점' : '%');
            questionHTML += `
                <div class="number-input-container">
                    <input type="text" inputmode="numeric" id="survey-q${q.number}" min="${q.min}" max="${q.max}" pattern="[0-9]*">
                    ${unit ? `<span class="percent-sign">${unit}</span>` : ''}
                </div>
            `;
        }
        
        questionItem.innerHTML = questionHTML;
        container.appendChild(questionItem);
    });
    
    // 첫 번째 질문 표시 및 버튼 초기화
    setTimeout(() => {
        showSurveyQuestion(0);
        // 버튼 강제 표시 확인
        const nextBtn = document.getElementById('survey-next-btn');
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
            nextBtn.style.visibility = 'visible';
            nextBtn.style.opacity = '1';
            nextBtn.disabled = false;
        }
        
        // 숫자 입력 필드에 숫자만 입력되도록 제한
        const numberInput8 = document.getElementById('survey-q8');
        const numberInput9 = document.getElementById('survey-q9');
        
        [numberInput8, numberInput9].forEach((input) => {
            if (input) {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    const num = parseInt(e.target.value);
                    if (!isNaN(num)) {
                        if (num > 100) {
                            e.target.value = '100';
                        } else if (num < 0) {
                            e.target.value = '0';
                        }
                    }
                });
                
                input.addEventListener('keypress', (e) => {
                    const char = String.fromCharCode(e.which);
                    if (!/[0-9]/.test(char)) {
                        e.preventDefault();
                    }
                });
            }
        });
    }, 100);
}

// 특정 설문 질문 표시
function showSurveyQuestion(index) {
    const container = document.getElementById('survey-questions-container');
    if (!container) return;
    
    const totalQuestions = 9;
    if (index < 0 || index >= totalQuestions) return;
    
    // 모든 질문 숨기기
    for (let i = 1; i <= totalQuestions; i++) {
        const item = document.getElementById(`survey-item-${i}`);
        if (item) {
            item.style.display = 'none';
        }
    }
    
    // 현재 질문 표시
    const currentItem = document.getElementById(`survey-item-${index + 1}`);
    if (currentItem) {
        currentItem.style.display = 'block';
        currentSurveyIndex = index;
        
        // 진행 상황 업데이트
        const progressEl = document.getElementById('survey-progress');
        if (progressEl) {
            progressEl.textContent = `질문 ${index + 1} / ${totalQuestions}`;
        }
        
        // 네비게이션 버튼 업데이트
        const nextBtn = document.getElementById('survey-next-btn');
        const submitBtn = document.getElementById('survey-submit-btn');
        
        // 다음 버튼과 완료 버튼 처리
        if (index < totalQuestions - 1) {
            // 마지막 질문이 아닌 경우
            if (nextBtn) {
                nextBtn.style.display = 'inline-block';
                nextBtn.style.visibility = 'visible';
                nextBtn.style.opacity = '1';
                nextBtn.disabled = false;
            }
            if (submitBtn) {
                submitBtn.style.display = 'none';
            }
        } else {
            // 마지막 질문인 경우
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }
            if (submitBtn) {
                submitBtn.style.display = 'inline-block';
                submitBtn.style.visibility = 'visible';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }
        }
    }
}

// 사후질문 설정
function setupPostSurvey() {
    const container = document.getElementById('post-survey-questions-container');
    if (!container) {
        console.error('post-survey-questions-container를 찾을 수 없습니다.');
        return;
    }
    
    // 기존 내용 제거 및 초기화
    container.innerHTML = '';
    currentPostSurveyIndex = 0;
    
    // 사후질문 목록
    const postSurveyQuestions = [
        {
            number: 1,
            type: 'scale',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요. (답변에 관계없이 실험이 완료되면 보상이 지급되니, 솔직하게 응답해주세요.)',
            question: '본 실험에 참여하기 전, 박쥐에 대해 얼마나 알고 있었나요?',
            subtitle: '박쥐에 대한 사전지식이 얼마나 있었는지 7점 척도로 응답해주세요.',
            scale: {
                min: 1,
                max: 7,
                minLabel: '박쥐에 대한 사전지식이 전혀 없었음',
                maxLabel: '박쥐에 대해 잘 알고 있었음'
            }
        },
        {
            number: 2,
            type: 'number',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요. (답변에 관계없이 실험이 완료되면 보상이 지급되니, 솔직하게 응답해주세요.)',
            question: '만약 학습단계 없이 실험을 시작하자마자 바로 박쥐에 대한 시험을 봤다면, 몇 %의 문제를 맞혔을 거라고 생각하나요?',
            subtitle: '0~100 사이의 숫자를 입력해주세요.',
            min: 0,
            max: 100
        },
        {
            number: 3,
            type: 'radio',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요. (답변에 관계없이 실험이 완료되면 보상이 지급되니, 솔직하게 응답해주세요.)',
            question: '본 연구의 학습 내용을 필기구나 휴대폰 등으로 기록했나요?',
            options: [
                { value: 'never', label: '전혀 하지 않았다.' },
                { value: 'sometimes', label: '가끔 했다.' },
                { value: 'often', label: '자주 했다' },
                { value: 'always', label: '거의 항상 했다' }
            ]
        },
        {
            number: 4,
            type: 'radio',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요. (답변에 관계없이 실험이 완료되면 보상이 지급되니, 솔직하게 응답해주세요.)',
            question: '본 연구 진행 중 시험 문제의 답을 인터넷에 검색한 적이 있나요?',
            options: [
                { value: 'never', label: '전혀 검색하지 않았다.' },
                { value: 'few', label: '몇 개 문항만 검색해 보았다.' },
                { value: 'most', label: '대부분의 문항을 검색해 보았다.' },
                { value: 'all', label: '모든 문항을 검색해 보았다.' }
            ]
        },
        {
            number: 5,
            type: 'text',
            instruction: '다음 질문을 읽고, 해당하는 정도에 체크해주세요. (답변에 관계없이 실험이 완료되면 보상이 지급되니, 솔직하게 응답해주세요.)',
            question: '본 연구 진행 중 발생한 문제가 있나요? (예. 네트워크 연결, 소음 등)',
            subtitle: '연구자가 알아야 할 내용이 있다면 자유롭게 적어주시고, 없으면 "없음" 이라고 적어주세요.',
            placeholder: '자유롭게 입력해주세요...'
        }
    ];
    
    // 모든 질문 생성 (숨김 처리)
    postSurveyQuestions.forEach((q) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'post-survey-item';
        questionItem.id = `post-survey-item-${q.number}`;
        questionItem.style.display = 'none';
        
        let questionHTML = `
            <div class="post-survey-instruction">${q.instruction}</div>
            <div class="post-survey-question">${q.question}</div>
        `;
        
        if (q.subtitle) {
            questionHTML += `<div class="post-survey-subtitle">${q.subtitle}</div>`;
        }
        
        if (q.type === 'scale') {
            questionHTML += `
                <div class="scale-container">
                    <div class="scale-labels">
                        <span class="scale-min">${q.scale.minLabel}</span>
                        <span class="scale-max">${q.scale.maxLabel}</span>
                    </div>
                    <div class="scale-options">
            `;
            for (let i = q.scale.min; i <= q.scale.max; i++) {
                questionHTML += `
                    <label class="scale-option">
                        <input type="radio" name="post-survey-q${q.number}" value="${i}">
                        <span>${i}</span>
                    </label>
                `;
            }
            questionHTML += `
                    </div>
                </div>
            `;
        } else if (q.type === 'number') {
            questionHTML += `
                <div class="number-input-container">
                    <input type="text" inputmode="numeric" id="post-survey-q${q.number}" min="${q.min}" max="${q.max}" pattern="[0-9]*">
                    <span class="percent-sign">%</span>
                </div>
            `;
        } else if (q.type === 'radio') {
            questionHTML += `<div class="radio-options-container">`;
            q.options.forEach((option) => {
                questionHTML += `
                    <label class="radio-option-large">
                        <input type="radio" name="post-survey-q${q.number}" value="${option.value}">
                        <span>${option.label}</span>
                    </label>
                `;
            });
            questionHTML += `</div>`;
        } else if (q.type === 'text') {
            questionHTML += `
                <textarea id="post-survey-q${q.number}" rows="5" placeholder="${q.placeholder || '자유롭게 입력해주세요...'}"></textarea>
            `;
        }
        
        questionItem.innerHTML = questionHTML;
        container.appendChild(questionItem);
    });
    
    // 첫 번째 질문 표시 및 버튼 초기화
    setTimeout(() => {
        showPostSurveyQuestion(0);
        // 버튼 강제 표시 확인
        const nextBtn = document.getElementById('post-survey-next-btn');
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
            nextBtn.style.visibility = 'visible';
            nextBtn.style.opacity = '1';
            nextBtn.disabled = false;
        }
        
        // 숫자 입력 필드에 숫자만 입력되도록 제한
        const numberInput = document.getElementById('post-survey-q2');
        if (numberInput) {
            numberInput.addEventListener('input', (e) => {
                // 숫자가 아닌 문자 제거
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                // 0-100 범위 제한
                const num = parseInt(e.target.value);
                if (!isNaN(num)) {
                    if (num > 100) {
                        e.target.value = '100';
                    } else if (num < 0) {
                        e.target.value = '0';
                    }
                }
            });
            
            // 키보드 입력 제한 (숫자만)
            numberInput.addEventListener('keypress', (e) => {
                const char = String.fromCharCode(e.which);
                if (!/[0-9]/.test(char)) {
                    e.preventDefault();
                }
            });
        }
    }, 100);
}

// 특정 사후질문 표시
function showPostSurveyQuestion(index) {
    const container = document.getElementById('post-survey-questions-container');
    if (!container) return;
    
    const totalQuestions = 5;
    if (index < 0 || index >= totalQuestions) return;
    
    // 모든 질문 숨기기
    for (let i = 1; i <= totalQuestions; i++) {
        const item = document.getElementById(`post-survey-item-${i}`);
        if (item) {
            item.style.display = 'none';
        }
    }
    
    // 현재 질문 표시
    const currentItem = document.getElementById(`post-survey-item-${index + 1}`);
    if (currentItem) {
        currentItem.style.display = 'block';
        currentPostSurveyIndex = index;
        
        // 진행 상황 업데이트
        const progressEl = document.getElementById('post-survey-progress');
        if (progressEl) {
            progressEl.textContent = `질문 ${index + 1} / ${totalQuestions}`;
        }
        
        // 네비게이션 버튼 업데이트
        const nextBtn = document.getElementById('post-survey-next-btn');
        const submitBtn = document.getElementById('post-survey-submit-btn');
        
        // 다음 버튼과 완료 버튼 처리
        if (index < totalQuestions - 1) {
            // 마지막 질문이 아닌 경우
            if (nextBtn) {
                nextBtn.style.display = 'inline-block';
                nextBtn.style.visibility = 'visible';
                nextBtn.style.opacity = '1';
                nextBtn.disabled = false;
            }
            if (submitBtn) {
                submitBtn.style.display = 'none';
            }
        } else {
            // 마지막 질문인 경우
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }
            if (submitBtn) {
                submitBtn.style.display = 'inline-block';
                submitBtn.style.visibility = 'visible';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }
        }
    }
}

// 타이머 시작 (백그라운드에서도 정확히 작동하도록 실제 경과 시간 기반)
function startTimer(timerId, duration, displayElement, onComplete) {
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    
    // 타이머 정보 저장
    if (!timers[timerId]) {
        timers[timerId] = {};
    }
    timers[timerId].endTime = endTime;
    timers[timerId].onComplete = onComplete;
    timers[timerId].displayElement = displayElement;
    
    function updateTimer() {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        displayElement.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        if (remaining <= 0) {
            clearInterval(timers[timerId].intervalId);
            delete timers[timerId].intervalId;
            if (onComplete) onComplete();
        }
    }
    
    // 초기 표시
    updateTimer();
    
    // 주기적으로 업데이트 (백그라운드에서도 정확한 시간 계산)
    timers[timerId].intervalId = setInterval(updateTimer, 100);
}

// 타이머 중지
function stopTimer(timerId) {
    if (timers[timerId]) {
        if (timers[timerId].intervalId) {
            clearInterval(timers[timerId].intervalId);
        }
        delete timers[timerId];
    }
}

// 지문 학습 단계
function startLearningStage() {
    showStage('learning');
    const timerDisplay = document.getElementById('learning-timer');
    
    experimentData.learning.startTime = new Date().toISOString();
    
    startTimer('learning', 420, timerDisplay, () => {
        // 시간이 지나면 자동으로 다음 단계로
        experimentData.learning.endTime = new Date().toISOString();
        const start = new Date(experimentData.learning.startTime);
        const end = new Date(experimentData.learning.endTime);
        experimentData.learning.duration = (end - start) / 1000;
        startReviewStage();
    });
}

// 복습 단계
function startReviewStage() {
    showStage('review');
    const timerDisplay = document.getElementById('review-timer');
    
    startTimer('review', 420, timerDisplay, () => {
        // 복습 데이터 저장
        const condition = experimentData.condition;
        if (condition === 1 || condition === 3) {
            experimentData.review.notes = document.getElementById('relearning-notes').value;
        }
        if (condition === 2 || condition === 4) {
            // 질문-답 10개 저장
            const questions = [];
            const questionItems = document.querySelectorAll('#questions-container .question-item');
            questionItems.forEach((item, index) => {
                const question = item.querySelector('.question-input').value;
                const answer = item.querySelector('.answer-input').value;
                questions.push({
                    number: index + 1,
                    question: question,
                    answer: answer
                });
            });
            experimentData.review.questions = questions;
        }
        
        experimentData.review.endTime = new Date().toISOString();
        const start = new Date(experimentData.review.startTime);
        const end = new Date(experimentData.review.endTime);
        experimentData.review.duration = (end - start) / 1000;
        
        // 시간이 지나면 자동으로 다음 단계로
        showStage('survey');
        experimentData.survey.startTime = new Date().toISOString();
    });
}

// 방해과제 문제 리스트
const distractorProblems = [
    "36-13", "14+47", "41-18", "15+32", "32-28", "12+17", "37-26", "27-12", "28+67", "45-18",
    "36-18", "51-32", "77+15", "43-19", "35-24", "42+38", "59+26", "52-12", "37-25", "64+28",
    "32-18", "52-33", "43-17", "32+57", "37-24", "28+53", "17+48", "26-18", "54-28", "29+63",
    "17+36", "15+42", "64-13", "20+44", "37-25", "15+57", "24+77", "62-15", "34-21", "29+65",
    "78-16", "53+37", "38+47", "45-22", "57-33", "11+45", "27+60", "29+54", "42-33", "28+51",
    "37+54", "55+23", "25+33", "36-27", "38-32", "28+44", "12+36", "54-27", "13+67", "51+48",
    "38-19", "67-28", "81+15", "96-25", "33+21", "47+14", "16+42", "32-15", "13+37", "19+11",
    "20+24", "12+38", "64-22", "79-15", "59-24", "54+14", "62-28", "34-25", "58-33", "16+27",
    "93-58", "43-21", "28+34", "57-29", "98-42", "12+63", "34-21", "49-17", "77+14", "31+24",
    "93-87", "70-26", "47-34", "24+57", "81-14", "21+69", "14+28", "84-17"
];

let currentDistractorProblemIndex = 0;
let distractorTimerActive = false;
let currentDistractorProblem = null;

// 방해과제 설정 (외부 호출용)
function setupDistractorTask() {
    showStage('distractor');
}

// 방해과제 내부 설정 (실제 초기화)
function setupDistractorTaskInternal() {
    // 데이터 초기화
    experimentData.distractor.startTime = new Date().toISOString();
    experimentData.distractor.correctCount = 0;
    experimentData.distractor.totalCount = 0;
    experimentData.distractor.problems = [];
    currentDistractorProblemIndex = 0;
    distractorTimerActive = true;
    currentDistractorProblem = null;
    
    // DOM 요소 가져오기 (화면이 활성화된 후)
    const distractorScreen = document.getElementById('distractor-screen');
    if (!distractorScreen || !distractorScreen.classList.contains('active')) {
        console.log('방해과제 화면이 아직 활성화되지 않았습니다. 재시도합니다...');
        setTimeout(() => setupDistractorTaskInternal(), 100);
        return;
    }
    
    const problemTextEl = distractorScreen.querySelector('.problem-text');
    const answerInput = distractorScreen.querySelector('#distractor-answer');
    const timerDisplay = distractorScreen.querySelector('#distractor-timer');
    
    if (!problemTextEl) {
        console.error('문제 텍스트 요소를 찾을 수 없습니다. 선택자: .problem-text');
        console.log('distractor-problem 요소:', distractorScreen.querySelector('#distractor-problem'));
    }
    if (!answerInput) {
        console.error('답변 입력 요소를 찾을 수 없습니다. 선택자: #distractor-answer');
    }
    if (!timerDisplay) {
        console.error('타이머 요소를 찾을 수 없습니다. 선택자: #distractor-timer');
    }
    
    if (!problemTextEl || !answerInput || !timerDisplay) {
        console.error('방해과제 요소를 찾을 수 없습니다. 재시도합니다...');
        setTimeout(() => setupDistractorTaskInternal(), 100);
        return;
    }
    
    // 입력창 초기화
    answerInput.disabled = false;
    answerInput.value = '';
    
    // 기존 이벤트 리스너 제거 후 새로 설정
    const newInput = answerInput.cloneNode(true);
    answerInput.parentNode.replaceChild(newInput, answerInput);
    const freshInput = document.getElementById('distractor-answer');
    
    // 입력창 이벤트 리스너 설정
    freshInput.addEventListener('keypress', (e) => {
        if (!distractorTimerActive) {
            e.preventDefault();
            return;
        }
        
        // 엔터 키로 답변 제출
        if (e.key === 'Enter') {
            e.preventDefault();
            submitDistractorAnswer();
        }
        // 숫자가 아닌 키는 차단
        else if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    // 숫자만 입력 가능하도록
    freshInput.addEventListener('input', (e) => {
        if (distractorTimerActive) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        }
    });
    
    // 첫 번째 문제 표시
    showNextDistractorProblem();
    
    // 타이머 시작 (2분 = 120초)
    startTimer('distractor', 120, timerDisplay, () => {
        // 시간 종료 처리
        distractorTimerActive = false;
        freshInput.disabled = true;
        
        // 데이터 저장
        experimentData.distractor.endTime = new Date().toISOString();
        const start = new Date(experimentData.distractor.startTime);
        const end = new Date(experimentData.distractor.endTime);
        experimentData.distractor.duration = (end - start) / 1000;
        
        // 다음 단계로 자동 이동 (지시문 단계)
        setTimeout(() => {
            showStage('final-test-instruction');
        }, 500);
    });
}

// 다음 방해과제 문제 표시
function showNextDistractorProblem() {
    if (!distractorTimerActive || currentDistractorProblemIndex >= distractorProblems.length) {
        return;
    }
    
    const problemStr = distractorProblems[currentDistractorProblemIndex];
    const match = problemStr.match(/(\d+)([+-])(\d+)/);
    
    if (!match) {
        currentDistractorProblemIndex++;
        if (currentDistractorProblemIndex < distractorProblems.length && distractorTimerActive) {
            showNextDistractorProblem();
        }
        return;
    }
    
    const num1 = parseInt(match[1]);
    const operation = match[2];
    const num2 = parseInt(match[3]);
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    
    // 현재 문제 정보 저장
    currentDistractorProblem = {
        num1,
        num2,
        operation: operation,
        answer: answer,
        userAnswer: null,
        correct: false,
        timestamp: new Date().toISOString(),
        problemString: problemStr
    };
    
    // 문제 표시
    const distractorScreen = document.getElementById('distractor-screen');
    const problemTextEl = distractorScreen ? distractorScreen.querySelector('.problem-text') : null;
    
    if (problemTextEl) {
        problemTextEl.textContent = `${num1} ${operation} ${num2}`;
        console.log('문제 표시 완료:', `${num1} ${operation} ${num2}`);
    } else {
        console.error('문제 텍스트 요소를 찾을 수 없습니다.');
        const problemBox = distractorScreen ? distractorScreen.querySelector('#distractor-problem') : null;
        if (problemBox) {
            console.log('distractor-problem 요소는 존재합니다:', problemBox);
            const textEl = problemBox.querySelector('.problem-text');
            if (textEl) {
                textEl.textContent = `${num1} ${operation} ${num2}`;
                console.log('대체 방법으로 문제 표시 완료');
            }
        } else {
            console.error('distractor-problem 요소 자체를 찾을 수 없습니다.');
        }
    }
    
    // 입력창 설정
    const answerInput = document.getElementById('distractor-answer');
    if (answerInput) {
        answerInput.value = '';
        answerInput.disabled = !distractorTimerActive;
        if (distractorTimerActive) {
            answerInput.focus();
        }
    }
}

// 방해과제 답변 제출 처리
function submitDistractorAnswer() {
    if (!distractorTimerActive || !currentDistractorProblem) {
        return;
    }
    
    const answerInput = document.getElementById('distractor-answer');
    if (!answerInput) {
        return;
    }
    
    const userAnswer = parseInt(answerInput.value);
    if (isNaN(userAnswer)) {
        return;
    }
    
    // 답변 저장
    currentDistractorProblem.userAnswer = userAnswer;
    currentDistractorProblem.correct = userAnswer === currentDistractorProblem.answer;
    
    if (currentDistractorProblem.correct) {
        experimentData.distractor.correctCount++;
    }
    experimentData.distractor.totalCount++;
    experimentData.distractor.problems.push({...currentDistractorProblem});
    
    // 다음 문제로 이동
    currentDistractorProblemIndex++;
    if (currentDistractorProblemIndex < distractorProblems.length && distractorTimerActive) {
        showNextDistractorProblem();
    }
}

// AI 챗봇 API 연동
// Cloudflare Workers 엔드포인트
const CHAT_API_URL = "https://experiment.syuun0315.workers.dev/chat";

async function sendChatMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    // 사용자 메시지 표시
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 입력 필드와 버튼 비활성화
    if (chatInput) {
        chatInput.disabled = true;
    }
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.textContent = '전송 중...';
    }
    
    // 로딩 메시지 표시
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'chat-message ai';
    loadingMsg.textContent = '답변을 생성하는 중...';
    loadingMsg.id = 'loading-message';
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        // Cloudflare Workers를 통한 OpenAI API 호출
        const response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API 오류: ${response.status} - ${errorData.error || errorData.message || '알 수 없는 오류'}`);
        }
        
        const data = await response.json();
        
        // OpenAI ChatCompletion 형식에서 응답 추출
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('응답 형식이 올바르지 않습니다.');
        }
        
        const aiResponse = data.choices[0].message.content;
        
        // 로딩 메시지 제거
        const loadingEl = document.getElementById('loading-message');
        if (loadingEl) {
            loadingEl.remove();
        }
        
        // AI 응답 표시
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-message ai';
        aiMsg.textContent = aiResponse;
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 채팅 메시지 저장
        experimentData.review.chatMessages.push({
            user: message,
            ai: aiResponse,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('AI API 오류:', error);
        
        // 로딩 메시지 제거
        const loadingEl = document.getElementById('loading-message');
        if (loadingEl) {
            loadingEl.remove();
        }
        
        // 오류 메시지 표시
        const errorMsg = document.createElement('div');
        errorMsg.className = 'chat-message ai';
        let errorText = '죄송합니다. 답변을 생성하는 중 오류가 발생했습니다.';
        
        // 네트워크 오류인지 확인
        if (error.message && error.message.includes('Failed to fetch')) {
            errorText += ' 네트워크 연결을 확인해주세요.';
        } else if (error.message) {
            errorText += ` (${error.message})`;
        }
        
        errorMsg.textContent = errorText;
        chatMessages.appendChild(errorMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 오류도 저장
        experimentData.review.chatMessages.push({
            user: message,
            ai: '오류 발생',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } finally {
        // 입력 필드와 버튼 다시 활성화
        if (chatInput) {
            chatInput.disabled = false;
            chatInput.focus();
        }
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = '전송';
        }
    }
}

// 데이터 다운로드
function downloadData() {
    // 최종 시간 기록
    experimentData.finalTest.endTime = new Date().toISOString();
    if (experimentData.finalTest.startTime) {
        const start = new Date(experimentData.finalTest.startTime);
        const end = new Date(experimentData.finalTest.endTime);
        experimentData.finalTest.duration = (end - start) / 1000;
    }
    
    const dataStr = JSON.stringify(experimentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment_data_${experimentData.participantId}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// 데이터 업로드
function uploadData() {
    const input = document.getElementById('upload-input');
    input.click();
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    console.log('업로드된 데이터:', data);
                    alert('데이터가 성공적으로 업로드되었습니다.');
                } catch (error) {
                    alert('데이터 파일을 읽는 중 오류가 발생했습니다.');
                }
            };
            reader.readAsText(file);
        }
    };
}

// 설계자 모드 (관리자 모드)
let designerMode = false;
let designerCondition = null; // 설계자 모드에서 선택한 조건

function toggleDesignerMode() {
    designerMode = !designerMode;
    const nav = document.getElementById('designer-nav');
    const body = document.body;
    
    if (designerMode) {
        nav.classList.add('show');
        body.classList.add('designer-mode');
        updateDesignerInfo();
        updateActiveNavButton();
        // 현재 실험 조건을 드롭다운에 설정
        if (experimentData.condition) {
            document.getElementById('condition-select').value = experimentData.condition;
        }
    } else {
        nav.classList.remove('show');
        body.classList.remove('designer-mode');
    }
}

function updateDesignerInfo() {
    const currentCondition = designerCondition || experimentData.condition;
    const conditionNames = {
        1: '조건 1: 지문으로 재학습',
        2: '조건 2: 지문으로 질문생성',
        3: '조건 3: 지문+AI로 재학습',
        4: '조건 4: 지문+AI로 질문생성'
    };
    document.getElementById('current-condition').textContent = 
        currentCondition ? conditionNames[currentCondition] : '-';
    document.getElementById('current-stage').textContent = currentStage || '-';
}

function updateActiveNavButton() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const stageMap = {
        'start': 'nav-start',
        'learning': 'nav-learning',
        'review': 'nav-review',
        'survey': 'nav-survey',
        'distractor': 'nav-distractor',
        'final-test-instruction': 'nav-instruction',
        'final-test': 'nav-final',
        'post-survey': 'nav-post-survey',
        'completion': 'nav-completion'
    };
    
    const activeBtn = document.getElementById(stageMap[currentStage]);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function applyDesignerCondition() {
    const selectedValue = parseInt(document.getElementById('condition-select').value);
    
    if (selectedValue) {
        designerCondition = selectedValue;
        experimentData.condition = selectedValue;
        updateDesignerInfo();
        
        // 복습 화면이 현재 활성화되어 있다면 조건에 맞게 업데이트
        if (currentStage === 'review') {
            setupReviewStage();
        }
    }
}

// 설계자용 네비게이션 이벤트 리스너
function setupDesignerNavigation() {
    const navButtons = {
        'nav-start': 'start',
        'nav-learning': 'learning',
        'nav-review': 'review',
        'nav-survey': 'survey',
        'nav-distractor': 'distractor',
        'nav-instruction': 'final-test-instruction',
        'nav-final': 'final-test',
        'nav-post-survey': 'post-survey',
        'nav-completion': 'completion'
    };
    
    Object.entries(navButtons).forEach(([btnId, stage]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                if (designerMode) {
                    // 모든 타이머 중지
                    Object.keys(timers).forEach(key => stopTimer(key));
                    
                    // 화면 전환
                    if (stage === 'start') {
                        showStage('start');
                    } else if (stage === 'learning') {
                        startLearningStage();
                    } else if (stage === 'review') {
                        startReviewStage();
                        // 복습 단계 설정 함수 호출하여 조건에 맞는 화면 표시
                        setupReviewStage();
                    } else if (stage === 'survey') {
                        showStage('survey');
                        experimentData.survey.startTime = new Date().toISOString();
                    } else if (stage === 'distractor') {
                        setupDistractorTask();
                    } else if (stage === 'final-test-instruction') {
                        showStage('final-test-instruction');
                    } else if (stage === 'final-test') {
                        showStage('final-test');
                        setTimeout(() => {
                            setupFinalTest();
                        }, 100);
                        experimentData.finalTest.startTime = new Date().toISOString();
                    } else if (stage === 'post-survey') {
                        showStage('post-survey');
                        setTimeout(() => {
                            setupPostSurvey();
                        }, 100);
                        experimentData.postSurvey.startTime = new Date().toISOString();
                    } else if (stage === 'completion') {
                        showStage('completion');
                    }
                    
                    updateActiveNavButton();
                    updateDesignerInfo();
                }
            });
        }
    });
}

// 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
    // 시작 버튼
    document.getElementById('start-btn').addEventListener('click', () => {
        const participantIdInput = document.getElementById('participant-id');
        const participantId = participantIdInput.value.trim();
        
        if (!participantId) {
            alert('참가자 ID를 입력해주세요.');
            participantIdInput.focus();
            return;
        }
        
        experimentData.participantId = participantId;
        assignCondition();
        startLearningStage();
    });
    
    // 설문 다음 버튼
    document.getElementById('survey-next-btn').addEventListener('click', () => {
        if (currentSurveyIndex < 8) {
            showSurveyQuestion(currentSurveyIndex + 1);
        }
    });
    
    // 설문 완료 버튼
    document.getElementById('survey-submit-btn').addEventListener('click', () => {
        // 모든 답변 수집
        const answers = {};
        
        // 질문 1-7: 7점 척도
        for (let i = 1; i <= 7; i++) {
            const q = document.querySelector(`input[name="survey-q${i}"]:checked`);
            if (q) answers[`q${i}`] = q.value;
        }
        
        // 질문 8-9: 숫자 입력
        const q8 = document.getElementById('survey-q8');
        const q9 = document.getElementById('survey-q9');
        if (q8) answers.q8 = q8.value;
        if (q9) answers.q9 = q9.value;
        
        // 데이터 저장
        experimentData.survey.answers = answers;
        experimentData.survey.endTime = new Date().toISOString();
        if (experimentData.survey.startTime) {
            const start = new Date(experimentData.survey.startTime);
            const end = new Date(experimentData.survey.endTime);
            experimentData.survey.duration = Math.floor((end - start) / 1000);
        }
        
        // 다음 단계로 이동
        setupDistractorTask();
    });
    
    
    
    // 최종 테스트 지시문 시작 버튼
    document.getElementById('start-final-test-btn').addEventListener('click', () => {
        showStage('final-test');
        // DOM이 준비된 후 setupFinalTest 호출
        setTimeout(() => {
            setupFinalTest();
        }, 100);
        experimentData.finalTest.startTime = new Date().toISOString();
    });
    
    // 최종 테스트 다음 문제 버튼
    document.getElementById('test-next-btn').addEventListener('click', () => {
        const questions = experimentData.finalTest.questions || finalTestQuestions;
        if (currentQuestionIndex < questions.length - 1) {
            showQuestion(currentQuestionIndex + 1);
        }
    });
    
    // 최종 테스트 제출 버튼
    document.getElementById('final-test-submit-btn').addEventListener('click', () => {
        // 모든 답변 수집
        const answers = {};
        const questions = experimentData.finalTest.questions || finalTestQuestions;
        questions.forEach((q) => {
            const answerInput = document.getElementById(`test-q${q.number}`);
            if (answerInput) {
                answers[`q${q.number}`] = answerInput.value;
            }
        });
        experimentData.finalTest.answers = answers;
        experimentData.finalTest.endTime = new Date().toISOString();
        const start = new Date(experimentData.finalTest.startTime);
        const end = new Date(experimentData.finalTest.endTime);
        experimentData.finalTest.duration = (end - start) / 1000;
        showStage('post-survey');
        // DOM이 준비된 후 setupPostSurvey 호출
        setTimeout(() => {
            setupPostSurvey();
        }, 100);
        experimentData.postSurvey.startTime = new Date().toISOString();
    });
    
    // 다운로드 버튼
    document.getElementById('download-btn').addEventListener('click', downloadData);
    
    // 업로드 버튼
    document.getElementById('upload-btn').addEventListener('click', uploadData);
    
    // AI 챗봇 전송 버튼
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            if (chatInput && !chatInput.disabled) {
                const message = chatInput.value.trim();
                if (message) {
                    sendChatMessage(message);
                    chatInput.value = '';
                }
            }
        });
    }
    
    // AI 챗봇 엔터 키
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !chatInput.disabled) {
                e.preventDefault();
                sendBtn.click();
            }
        });
    }
    
    // 사후질문 다음 버튼
    document.getElementById('post-survey-next-btn').addEventListener('click', () => {
        if (currentPostSurveyIndex < 4) {
            showPostSurveyQuestion(currentPostSurveyIndex + 1);
        }
    });
    
    // 사후질문 제출 버튼
    document.getElementById('post-survey-submit-btn').addEventListener('click', () => {
        // 모든 답변 수집
        const answers = {};
        
        // 질문 1: 7점 척도
        const q1 = document.querySelector('input[name="post-survey-q1"]:checked');
        if (q1) answers.q1 = q1.value;
        
        // 질문 2: 숫자 입력
        const q2 = document.getElementById('post-survey-q2');
        if (q2) answers.q2 = q2.value;
        
        // 질문 3: 라디오 버튼
        const q3 = document.querySelector('input[name="post-survey-q3"]:checked');
        if (q3) answers.q3 = q3.value;
        
        // 질문 4: 라디오 버튼
        const q4 = document.querySelector('input[name="post-survey-q4"]:checked');
        if (q4) answers.q4 = q4.value;
        
        // 질문 5: 텍스트 입력
        const q5 = document.getElementById('post-survey-q5');
        if (q5) answers.q5 = q5.value;
        
        experimentData.postSurvey.answers = answers;
        experimentData.postSurvey.endTime = new Date().toISOString();
        const start = new Date(experimentData.postSurvey.startTime);
        const end = new Date(experimentData.postSurvey.endTime);
        experimentData.postSurvey.duration = (end - start) / 1000;
        showStage('completion');
    });
    
    // 설계자 모드 네비게이션 설정
    setupDesignerNavigation();
    
    // 조건 적용 버튼
    document.getElementById('apply-condition').addEventListener('click', applyDesignerCondition);
    
    // 설계자 모드 단축키 (Ctrl + Shift + D)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleDesignerMode();
        }
    });
});

