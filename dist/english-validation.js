// Use English validation messages even when the visitor's browser uses another language.
document.querySelectorAll('[data-demo-form] input').forEach((field) => {
  field.addEventListener('invalid', () => {
    if (field.validity.valueMissing) field.setCustomValidity(field.type === 'checkbox' ? 'Please tick this box to continue.' : 'Please complete this field.');
    else if (field.validity.typeMismatch) field.setCustomValidity('Please check the format.');
    else if (field.validity.patternMismatch) field.setCustomValidity('Please follow the format shown.');
  });
  const clear = () => field.setCustomValidity('');
  field.addEventListener('input', clear);
  field.addEventListener('change', clear);
});
