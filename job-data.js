/*
 * 취업활동 페이지에 표시되는 데이터입니다.
 * 아래 값은 모두 샘플입니다. 실제 값으로 바꾼 뒤 sample 을 false 로 바꾸세요.
 * (포트폴리오 문서 수와 날짜는 index.html 의 카드에서 자동으로 읽어옵니다.)
 */
window.JOB_DATA = {
    sample: true,
    updated: '2026.11.19',

    // 지원 퍼널: 위 단계일수록 값이 크거나 같아야 합니다.
    funnel: [
        { label: '지원', value: 24 },
        { label: '서류 통과', value: 9 },
        { label: '과제·테스트', value: 6 },
        { label: '면접', value: 4 },
        { label: '최종 합격', value: 1 }
    ],

    // 월별 지원 건수
    monthly: [
        { label: '8월', value: 2 },
        { label: '9월', value: 5 },
        { label: '10월', value: 9 },
        { label: '11월', value: 8 }
    ],

    // 직무별 지원 건수
    roles: [
        { label: 'QA', value: 12 },
        { label: '게임 기획', value: 7 },
        { label: '운영', value: 3 },
        { label: '기타', value: 2 }
    ],

    // 준비 항목 달성도
    skills: [
        { label: '면접 질문 정리', current: 18, target: 30, unit: '개' },
        { label: 'QA 사례 정리', current: 6, target: 10, unit: '건' },
        { label: '지원서 템플릿', current: 3, target: 5, unit: '종' },
        { label: '모의 면접', current: 2, target: 5, unit: '회' }
    ],

    // 최근 12주 일별 준비 시간 (시간). 한 줄이 1주, 월~일 순서
    weeks: [
        [0, 1, 2, 1, 0, 0, 0],
        [1, 2, 2, 1, 1, 0, 0],
        [0, 2, 3, 2, 1, 1, 0],
        [1, 1, 2, 2, 0, 0, 1],
        [2, 3, 2, 2, 1, 0, 0],
        [1, 2, 3, 3, 2, 1, 0],
        [0, 1, 1, 2, 1, 0, 0],
        [2, 3, 3, 2, 2, 1, 1],
        [3, 3, 4, 3, 2, 2, 1],
        [2, 4, 3, 3, 3, 1, 0],
        [3, 3, 4, 4, 2, 2, 1],
        [2, 3, 3, 2, 1, 0, 0]
    ],

    // 지원 현황
    applications: [
        { company: '게임사 A', role: 'QA', stage: '최종 합격', date: '11.14' },
        { company: '게임사 B', role: 'QA', stage: '면접', date: '11.12' },
        { company: '게임사 C', role: '게임 기획', stage: '과제·테스트', date: '11.08' },
        { company: '게임사 D', role: '운영', stage: '서류 통과', date: '11.05' },
        { company: '게임사 E', role: 'QA', stage: '서류 불합격', date: '10.30' },
        { company: '게임사 F', role: '게임 기획', stage: '서류 대기', date: '10.27' }
    ],

    // 다음 할 일
    todo: [
        '게임사 B 2차 면접 준비',
        '게임사 C 과제 제출',
        '면접 질문 12개 추가 정리',
        '포트폴리오 문서 1건 추가'
    ]
};
