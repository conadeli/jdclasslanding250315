document.addEventListener('DOMContentLoaded', function() {
    // Chart.js ��ũ��Ʈ �ε�
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js';
    document.head.appendChild(chartScript);
    
    // Chart.js �ε� �Ϸ� �� �׷��� �ʱ�ȭ �� �� ��� ����
    chartScript.onload = function() {
        initializeCharts();
        
        // �� ��� ����
        const tabButtons = document.querySelectorAll('.tab-btn');
        const graphItems = document.querySelectorAll('.graph-item');
        
        if(tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // ��� �ǰ� �׷��� ��Ȱ��ȭ
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    graphItems.forEach(item => item.classList.remove('active'));
                    
                    // Ŭ���� �ǰ� ����� �׷��� Ȱ��ȭ
                    this.classList.add('active');
                    const targetGraph = document.getElementById(`${this.dataset.target}-graph`);
                    if(targetGraph) {
                        targetGraph.classList.add('active');
                    }
                });
            });
        }
    };
    
    // ���� �÷��̾� �ʱ�ȭ (��Ʃ�� �Ǵ� ��޿�)
    function initializeVideoPlayer() {
        const videoSection = document.getElementById('video-player');
        if (!videoSection) return;
        
        // �⺻�� ���� (���߿� CMS���� �����͸� �ε��� �� ����)
        let platform = 'youtube'; // �Ǵ� 'vimeo'
        let videoId = 'VIDEO_ID'; // ���� ID
        
        let embedHtml = '';
        if (platform === 'youtube') {
            embedHtml = `<iframe width="100%" height="500" src="https://www.youtube.com/embed/${videoId}" 
                         title="���� ����" frameborder="0" 
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
    
    // ���� �÷��̾� �ʱ�ȭ
    initializeVideoPlayer();
    
    // ��ũ�� �� ��� ��Ÿ�� ����
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

    // ��� ��û �� ����
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(event) {
            const phoneInput = document.getElementById('parentPhone');
            const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
            
            if (!phonePattern.test(phoneInput.value)) {
                event.preventDefault();
                alert('����ó�� 010-0000-0000 �������� �Է����ּ���.');
                phoneInput.focus();
                return false;
            }
            
            // ��� ��¥ ��ȿ�� �˻�
            const dateInput = document.getElementById('consultDate');
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            if (selectedDate < today) {
                event.preventDefault();
                alert('���� ������ ��¥�� �������ּ���.');
                dateInput.focus();
                return false;
            }
            
            // �� ���� �� �ε� �޽��� ǥ��
            const submitButton = consultationForm.querySelector('button[type="submit"]');
            submitButton.innerHTML = '���� ��...';
            submitButton.disabled = true;
            
            return true;
        });
        
        // ��ȭ��ȣ �Է� �� �ڵ� ������ �߰�
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
    
    // ��ũ�� �� ���� �ִϸ��̼� ȿ��
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    });
    
    // ������ ��ũ�� ����
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
    
    // �׷��� �ʱ�ȭ �Լ�
    function initializeCharts() {
        // ��Ʈ ��Ұ� ������ ����
        if (!document.getElementById('readingChart')) return;
        
        // ���� ��Ʈ ����
        const months = ['����', '1����', '2����', '3����', '4����', '5����', '6����'];
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '�ɷ� ���� (100�� ����)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '�н� �Ⱓ'
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
                            return `${context.dataset.label}: ${context.raw}��`;
                        }
                    }
                }
            }
        };
        
        // 1. ���ط� ��Ʈ
        const readingCtx = document.getElementById('readingChart').getContext('2d');
        new Chart(readingCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '���ط� ����',
                    data: [45, 52, 58, 67, 75, 82, 90],
                    borderColor: '#FF8C00',
                    backgroundColor: 'rgba(255, 140, 0, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: chartOptions
        });
        
        // 2. ��� ��Ʈ
        const listeningCtx = document.getElementById('listeningChart').getContext('2d');
        new Chart(listeningCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '��� ����',
                    data: [40, 48, 55, 63, 72, 80, 88],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: chartOptions
        });
        
        // 3. ���ַ� ��Ʈ
        const vocabularyCtx = document.getElementById('vocabularyChart').getContext('2d');
        new Chart(vocabularyCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '���ַ� ����',
                    data: [42, 50, 60, 70, 78, 85, 92],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: chartOptions
        });
        
        // 4. ���� ��Ʈ
        const grammarCtx = document.getElementById('grammarChart').getContext('2d');
        new Chart(grammarCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '���� ����',
                    data: [48, 55, 62, 70, 77, 84, 91],
                    borderColor: '#9C27B0',
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: chartOptions
        });
        
        // 5. ���� ���� ��Ʈ
        const overallCtx = document.getElementById('overallChart').getContext('2d');
        new Chart(overallCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: '���ط�',
                        data: [45, 52, 58, 67, 75, 82, 90],
                        borderColor: '#FF8C00',
                        backgroundColor: 'transparent',
                        borderWidth: 2
                    },
                    {
                        label: '���',
                        data: [40, 48, 55, 63, 72, 80, 88],
                        borderColor: '#4CAF50',
                        backgroundColor: 'transparent',
                        borderWidth: 2
                    },
                    {
                        label: '���ַ�',
                        data: [42, 50, 60, 70, 78, 85, 92],
                        borderColor: '#2196F3',
                        backgroundColor: 'transparent',
                        borderWidth: 2
                    },
                    {
                        label: '����',
                        data: [48, 55, 62, 70, 77, 84, 91],
                        borderColor: '#9C27B0',
                        backgroundColor: 'transparent',
                        borderWidth: 2
                    },
                    {
                        label: '��� ����',
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
