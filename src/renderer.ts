interface Window {
  api: {
      getPrograms: () => Promise<string[]>;
  };
}

const programSelect = document.getElementById('program-select') as HTMLSelectElement;
const startButton = document.getElementById('start-button') as HTMLButtonElement;
const timeLimitInput = document.getElementById('time-limit') as HTMLInputElement;

window.api.getPrograms().then(programs => {
  programs.forEach(program => {
      const option = document.createElement('option');
      option.value = program;
      option.textContent = program;
      programSelect.appendChild(option);
  });
});

startButton.addEventListener('click', () => {
  const selectedProgram = programSelect.value;
  const timeLimit = parseInt(timeLimitInput.value, 10);

  if (!selectedProgram || !timeLimit) {
      alert('프로그램과 시간을 모두 설정해주세요.');
      return;
  }

  alert(`${selectedProgram}이(가) ${timeLimit}분 후 종료됩니다.`);
  // TODO: 타이머 추가 및 강제 종료 로직 구현
});
