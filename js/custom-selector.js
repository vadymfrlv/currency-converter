document.querySelectorAll('.select-wrapper').forEach(setupSelector);

function setupSelector(selector) {
  selector.addEventListener('mousedown', event => {
    event.preventDefault();

    const select = selector.children[0];
    const dropDown = document.createElement('ul');
    dropDown.className = 'selector-options';

    [...select.children].forEach(option => {
      const dropDownOption = document.createElement('li');
      dropDownOption.textContent = option.textContent;

      dropDownOption.addEventListener('mousedown', event => {
        event.stopPropagation();
        select.value = option.value;
        selector.value = option.value;
        select.dispatchEvent(new Event('change'));
        selector.dispatchEvent(new Event('change'));
        dropDown.remove();
      });

      dropDown.appendChild(dropDownOption);
    });

    selector.appendChild(dropDown);

    // handle click out
    document.addEventListener('click', event => {
      if (!selector.contains(event.target)) {
        dropDown.remove();
      }
    });
  });
}
