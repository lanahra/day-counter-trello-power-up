/* global TrelloPowerUp */

const COLOR_CODING_DEFAULT = {
  yellowThreshold: 5,
  orangeThreshold: 10,
  redThreshold: 14
};

var t = TrelloPowerUp.iframe();

window.yellowThreshold.addEventListener('input', (event) => {
  const yellow = parseInt(window.yellowThreshold.value, 10);
  const orange = parseInt(window.orangeThreshold.value, 10);
  const red = parseInt(window.redThreshold.value, 10);
  if (yellow >= orange) {
    window.yellowThreshold.setCustomValidity(
      'Value must be less than Orange threshold.'
    );
  } else if (yellow >= red) {
    window.yellowThreshold.setCustomValidity(
      'Value must be less than Red threshold.'
    );
  } else {
    window.yellowThreshold.setCustomValidity('');
  }
});

window.orangeThreshold.addEventListener('input', (event) => {
  const yellow = parseInt(window.yellowThreshold.value, 10);
  const orange = parseInt(window.orangeThreshold.value, 10);
  const red = parseInt(window.redThreshold.value, 10);
  if (orange <= yellow) {
    window.orangeThreshold.setCustomValidity(
      'Value must be greater than Yellow threshold.'
    );
  } else if (orange >= red) {
    window.orangeThreshold.setCustomValidity(
      'Value must be less than Red threshold.'
    );
  } else {
    window.orangeThreshold.setCustomValidity('');
  }
});

window.redThreshold.addEventListener('input', (event) => {
  const yellow = parseInt(window.yellowThreshold.value, 10);
  const orange = parseInt(window.orangeThreshold.value, 10);
  const red = parseInt(window.redThreshold.value, 10);
  if (red <= yellow) {
    window.redThreshold.setCustomValidity(
      'Value must be greater than Yellow threshold.'
    );
  } else if (red <= orange) {
    window.redThreshold.setCustomValidity(
      'Value must be greater than Orange threshold.'
    );
  } else {
    window.redThreshold.setCustomValidity('');
  }
});

window.colorCoding.addEventListener('submit', (event) => {
  event.preventDefault();
  const colorCoding = {
    yellowThreshold: parseInt(window.yellowThreshold.value, 10),
    orangeThreshold: parseInt(window.orangeThreshold.value, 10),
    redThreshold: parseInt(window.redThreshold.value, 10)
  };
  return t.set('board', 'shared', 'colorCoding', colorCoding).then(() => {
    t.closePopup();
  });
});

t.render(() => {
  return t
    .get('board', 'shared', 'colorCoding')
    .then((colorCoding) => {
      if (colorCoding) {
        window.yellowThreshold.value = colorCoding.yellowThreshold;
        window.orangeThreshold.value = colorCoding.orangeThreshold;
        window.redThreshold.value = colorCoding.redThreshold;
      } else {
        window.yellowThreshold.value = COLOR_CODING_DEFAULT.yellowThreshold;
        window.orangeThreshold.value = COLOR_CODING_DEFAULT.orangeThreshold;
        window.redThreshold.value = COLOR_CODING_DEFAULT.redThreshold;
        const permissions = t.getContext().permissions;
        if (permissions.board === 'write') {
          t.set('board', 'shared', 'colorCoding', COLOR_CODING_DEFAULT);
        }
      }
    })
    .then(() => {
      t.sizeTo('#colorCoding').done();
    });
});
