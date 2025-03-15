document.addEventListener('DOMContentLoaded', function () {
    if (typeof Chart !== 'undefined') {
        initializeCharts();
    } else {
        console.error('Chart.js가 로드되지 않았습니다.');
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const graphItems = document.querySelectorAll('.graph-item');

    graphItems.forEach(function (item) {
        item.style.display = 'none';
    });

    if (tabButtons.length > 0) {
        tabButtons[0].classList.add('active');
        const firstGraph = document.getElementById(tabButtons[0].dataset.target + '-graph');
        if (firstGraph) {
            firstGraph.style.display = 'block';
        }
    }

    tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            tabButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });

            graphItems.forEach(function (item) {
                item.style.display = 'none';
            });

            this.classList.add('active');
            const targetGraph = document.getElementById(this.dataset.target + '-graph');
            if (targetGraph) {
                targetGraph.style.display = 'block';
            }
        });
    });
});
    // 비디오 플레이어 초기화 (반응형 처리)
    function initializeVideoPlayer() {
        var videoSection = document.getElementById('video-player');
        if (!videoSection) return;
        
        // 임시 하드코딩 (유튜브 또는 비메오)
        var platform = 'youtube';
        var videoId = 'VIDEO_ID'; // 실제 유튜브 영상 ID로 교체하세요.
        
        var embedHtml = '';
        if (platform === 'youtube') {
            embedHtml = '<iframe src="https://www.youtube.com/embed/' + videoId + '" ' +
                        'title="수업 영상" frameborder="0" ' +
                        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
                        'allowfullscreen></iframe>';
        } else if (platform === 'vimeo') {
            embedHtml = '<iframe src="https://player.vimeo.com/video/' + videoId + '" ' +
                        'frameborder="0" ' +
                        'allow="autoplay; fullscreen; picture-in-picture" ' +
                        'allowfullscreen></iframe>';
        }
        
        // iframe을 반응형 비디오 컨테이너로 감싸기
        videoSection.innerHTML = '<div class="video-container">' + embedHtml + '</div>';
    }
    
    initializeVideoPlayer();
    
    // 헤더 스크롤 스타일 변경
    var header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '15px 0';
        }
    });
    
    // 상담 폼 검증
    var consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(event) {
            var phoneInput = document.getElementById('parentPhone');
            var phonePattern = /^\d{3}-\d{4}-\d{4}$/;
            if (!phonePattern.test(phoneInput.value)) {
                event.preventDefault();
                alert('연락처를 010-0000-0000 형식으로 입력해주세요.');
                phoneInput.focus();
                return false;
            }
            
            var dateInput = document.getElementById('consultDate');
            var selectedDate = new Date(dateInput.value);
            var today = new Date();
            if (selectedDate < today) {
                event.preventDefault();
                alert('오늘 이후의 날짜를 선택해주세요.');
                dateInput.focus();
                return false;
            }
            
            var submitButton = consultationForm.querySelector('button[type="submit"]');
            submitButton.innerHTML = '제출 중...';
            submitButton.disabled = true;
            return true;
        });
        
        // 전화번호 입력 시 하이픈 자동 추가
        var phoneInput = document.getElementById('parentPhone');
        phoneInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/[^0-9]/g, '');
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
    var sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        sections.forEach(function(section) {
            var sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    });
    
    // 스무스 스크롤 구현
    var navLinks = document.querySelectorAll('nav a, .hero a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var targetSection = document.querySelector(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
      // 차트 초기화 함수
    function initializeCharts() {
        if (!document.getElementById('readingChart')) return;
        
        var months = ['시작', '1개월', '2개월', '3개월', '4개월', '5개월', '6개월'];
        var chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    devicePixelRatio: 2, // 고해상도 지원 추가
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
                    return context.dataset.label + ': ' + context.raw + '점';
                }
            }
        }
    }
};


        
// 독해력 차트
var readingCtx = document.getElementById('readingChart').getContext('2d');
new Chart(readingCtx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [{
            label: '독해력 점수',
            data: [45, 52, 58, 67, 75, 82, 90],
            borderColor: '#FF8C00',
            backgroundColor: 'rgba(255, 140, 0, 0.2)', // 투명도 증가
            fill: true,
            tension: 0.2, // 장력 감소
            borderWidth: 2.5 // 선 두께 증가
        }]
    },
    options: {
        ...chartOptions,
        devicePixelRatio: 2, // 고해상도 지원
        animation: {
            duration: 0 // 애니메이션 비활성화
        }
    }
});
        
        // 듣기 차트
        var listeningCtx = document.getElementById('listeningChart').getContext('2d');
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
        
        // 어휘력 차트
        var vocabularyCtx = document.getElementById('vocabularyChart').getContext('2d');
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
        
        // 문법 차트
        var grammarCtx = document.getElementById('grammarChart').getContext('2d');
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
        
        // 종합 점수 차트
        var overallCtx = document.getElementById('overallChart').getContext('2d');
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
