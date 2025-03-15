document.addEventListener('DOMContentLoaded', function() {
    // Chart.js 스크립트 로드
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js';
    document.head.appendChild(chartScript);
    
    // Chart.js 로드 완료 후 그래프 초기화 및 탭 기능 설정
    chartScript.onload = function() {
        initializeCharts();
        
        // 탭 기능 구현
        const tabButtons = document.querySelectorAll('.tab-btn');
        const graphItems = document.querySelectorAll('.graph-item');
        
        if(tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // 모든 탭과 그래프 비활성화
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    graphItems.forEach(item => item.classList.remove('active'));
                    
                    // 클릭한 탭과 연결된 그래프 활성화
                    this.classList.add('active');
                    const targetGraph = document.getElementById(`${this.dataset.target}-graph`);
                    if(targetGraph) {
                        targetGraph.classList.add('active');
                    }
                });
            });
        }
    };
    
    // 비디오 플레이어 초기화 (유튜브 또는 비메오)
    function initializeVideoPlayer() {
        const videoSection = document.getElementById('video-player');
        if (!videoSection) return;
        
        // 기본값 설정 (나중에 CMS에서 데이터를 로드할 수 있음)
        let platform = 'youtube'; // 또는 'vimeo'
        let videoId = 'VIDEO_ID'; // 샘플 ID
        
        let embedHtml = '';
        if (platform === 'youtube') {
            embedHtml = `<iframe width="100%" height="500" src="https://www.youtube.com/embed/${videoId}" 
                         title="수업 영상" frameborder="0" 
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                         allowfullscreen></iframe>`;
        } else if (platform === 'vimeo') {
            embedHtml = `<iframe src="https://player.vimeo.com/video/${videoId}" 
                         width="100%" height="500" frameborder="0" 
                         allow="autoplay; fullscreen; picture-in-picture" 
                         allowfullscreen></iframe>`;
        }
        videoSection.innerHTML = embedHtml;
    }
    
    // 비디오 플레이어 초기화
    initializeVideoPlayer();
    
    // 스크롤 시 헤더 스타일 변경
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '15px 0';
        }
    });

    // 상담 신청 폼 검증
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(event) {
            const phoneInput = document.getElementById('parentPhone');
            const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
            
            if (!phonePattern.test(phoneInput.value)) {
                event.preventDefault();
                alert('연락처를 010-0000-0000 형식으로 입력해주세요.');
                phoneInput.focus();
                return false;
            }
            
            // 상담 날짜 유효성 검사
            const dateInput = document.getElementById('consultDate');
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            if (selectedDate < today) {
                event.preventDefault();
                alert('오늘 이후의 날짜를 선택해주세요.');
                dateInput.focus();
                return false;
            }
            
            // 폼 제출 시 로딩 메시지 표시
            const submitButton = consultationForm.querySelector('button[type="submit"]');
            submitButton.innerHTML = '제출 중...';
            submitButton.disabled = true;
            
            return true;
        });
        
        // 전화번호 입력 시 자동 하이픈 추가
        const phoneInput = document.getElementById('parentPhone');
        phoneInput.addEventListener('input', function(e) {
            const value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length <= 3) {
                e.target.value = value;
            } else if (value.length <= 7) {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
            }
        });
    }
    
    // 스크롤 시 섹션 애니메이션 효과
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    });
    
    // 스무스 스크롤 구현
    const navLinks = document.querySelectorAll('nav a, .hero a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // 그래프 초기화 함수
    function initializeCharts() {
        // 차트 요소가 없으면 리턴
        if (!document.getElementById('readingChart')) return;
        
        // 공통 차트 설정
        const months = ['시작', '1개월', '2개월', '3개월', '4개월', '5개월', '6개월'];
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '능력 점수 (100점 만점)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '학습 기간'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}점`;
                        }
                    }
                }
            }
        };
        
        // 1. 독해력 차트
        const readingCtx = document.getElementById('readingChart').getContext('2d');
        new Chart(readingCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '독해력 점수',
                    data: [45, 52, 58, 67, 75, 82, 90],
                    borderColor: '#FF8C00',
                    backgroundColor: 'rgba(255, 140, 0, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: chartOptions
        });
        
        // 2. 듣기 차트
        const listeningCtx = document.getElementById('listeningChart').getContext('2d');
        new Chart(listeningCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '듣기 점수',
                    data: [40, 48, 55, 63, 72, 80, 88],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: chartOptions
        });
        
        // 3. 어휘력 차트
        const vocabularyCtx = document.getElementById('vocabularyChart').getContext('2d');
        new Chart(vocabularyCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '어휘력 점수',
                    data: [42, 50, 60, 70, 78, 85, 92],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: chartOptions
        });
        
        // 4. 문법 차트
        const grammarCtx = document.getElementById('grammarChart').getContext('2d');
        new Chart(grammarCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '문법 점수',
                    data: [48, 55, 62, 70, 77, 84, 91],
                    borderColor: '#9C27B0',
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: chartOptions
        });
        
        // 5. 종합 점수 차트
        const overallCtx = document.getElementById('overallChart').getContext('2d');
        new Chart(overallCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: '독해력',
                        data: [45, 52, 58, 67, 75, 82, 90],
                        borderColor: '#FF8C00',
                        backgroundColor: 'transparent',
                        borderWidth: 2
                    },
                    {
                        label: '듣기',
                        data: [40, 48, 55, 63, 72, 80, 88],
                        borderColor: '#4CAF50',
                        backgroundColor: 'transparent',
                        borderWidth: 2
                    },
                    {
                        label: '어휘력',
                        data: [42, 50, 60, 70, 78, 85, 92],
                        borderColor: '#2196F3',
                        backgroundColor: 'transparent',
                        borderWidth: 2
                    },
                    {
                        label: '문법',
                        data: [48, 55, 62, 70, 77, 84, 91],
                        borderColor: '#9C27B0',
                        backgroundColor: 'transparent',
                        borderWidth: 2
                    },
                    {
                        label: '평균 점수',
                        data: [44, 51, 59, 68, 76, 83, 90],
                        borderColor: '#FF5722',
                        backgroundColor: 'rgba(255, 87, 34, 0.1)',
                        borderWidth: 3,
                        fill: true
                    }
                ]
            },
            options: chartOptions
        });
    }
});
