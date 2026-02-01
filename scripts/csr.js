document.addEventListener('DOMContentLoaded', () => {
    const steps = [
        document.getElementById('csr-step-1'),
        document.getElementById('csr-step-2'),
        document.getElementById('csr-step-3')
    ];
    const nextBtn = document.getElementById('csr-next-btn');
    const backBtn = document.getElementById('csr-back-btn');
    const progressBar = document.getElementById('csr-progress-bar');
    const currentStepDisplay = document.getElementById('csr-current-step');
    const successMessage = document.getElementById('csr-success-message');
    const summaryContainer = document.getElementById('csr-summary');

    // Section Toggle Elements
    const fundingFields = document.getElementById('funding-fields');
    const trainersFields = document.getElementById('trainers-fields');
    const radioButtons = document.querySelectorAll('input[name="csr_type"]');

    let currentStepIndex = 0;

    // Initial State
    updateUI();

    // Radio Button Logic
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'funding') {
                fundingFields.classList.remove('hidden');
                trainersFields.classList.add('hidden');
            } else {
                fundingFields.classList.add('hidden');
                trainersFields.classList.remove('hidden');
            }
        });
    });

    // Navigation Logic
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStepIndex)) {
            if (currentStepIndex < steps.length - 1) {
                currentStepIndex++;
                updateUI();
                if (currentStepIndex === steps.length - 1) {
                    populateSummary();
                    nextBtn.textContent = 'Submit';
                }
            } else {
                // Submit Logic
                submitForm();
            }
        }
    });

    backBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateUI();
            nextBtn.textContent = 'Next →';
        }
    });

    function updateUI() {
        // Show/Hide steps
        steps.forEach((step, index) => {
            if (index === currentStepIndex) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });

        // Update progress
        currentStepDisplay.textContent = currentStepIndex + 1;
        const progress = ((currentStepIndex + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Button visibility
        if (currentStepIndex === 0) {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }

        // Hide next button if submitted
        if (successMessage.classList.contains('hidden') === false) {
            nextBtn.classList.add('hidden');
            backBtn.classList.add('hidden');
        }
    }

    function validateStep(index) {
        let isValid = true;
        const currentStepEl = steps[index];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            // Simple empty check
            const validationMsg = document.getElementById(`${input.id}-validation`);
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500'); // simple error style
                if (validationMsg) validationMsg.classList.remove('hidden');
            } else {
                input.classList.remove('border-red-500');
                if (validationMsg) validationMsg.classList.add('hidden');
            }
        });

        // Specific validation for step 2 dynamic fields
        if (index === 1) {
            const type = document.querySelector('input[name="csr_type"]:checked').value;
            let dynamicInputs = [];
            if (type === 'funding') {
                dynamicInputs = [
                    document.getElementById('project-title'),
                    document.getElementById('project-desc'),
                    document.getElementById('funding-amount')
                ];
            } else {
                dynamicInputs = [
                    document.getElementById('training-topic'),
                    document.getElementById('trainee-count'),
                    document.getElementById('training-location')
                ];
            }

            dynamicInputs.forEach(input => {
                // We can make these required logically even if not HTML attribute
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = "red";
                } else {
                    input.style.borderColor = ""; // reset
                }
            });
        }

        return isValid;
    }

    function populateSummary() {
        const type = document.querySelector('input[name="csr_type"]:checked').value;
        const typeLabel = type === 'funding' ? 'Fund Initiative' : 'Need Trainers';

        const name = document.getElementById('csr-name').value;
        const email = document.getElementById('csr-email').value;
        const org = document.getElementById('csr-org').value;

        let dynamicContent = '';
        if (type === 'funding') {
            dynamicContent = `
                <div class="flex justify-between border-b pb-2">
                    <span class="font-semibold text-gray-700">Project:</span>
                    <span class="text-gray-900">${document.getElementById('project-title').value}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="font-semibold text-gray-700">Budget:</span>
                    <span class="text-gray-900">${document.getElementById('funding-amount').value}</span>
                </div>
            `;
        } else {
            dynamicContent = `
                <div class="flex justify-between border-b pb-2">
                    <span class="font-semibold text-gray-700">Topic:</span>
                    <span class="text-gray-900">${document.getElementById('training-topic').value}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="font-semibold text-gray-700">Trainees:</span>
                    <span class="text-gray-900">${document.getElementById('trainee-count').value}</span>
                </div>
            `;
        }

        summaryContainer.innerHTML = `
            <div class="flex justify-between border-b pb-2">
                <span class="font-semibold text-gray-700">Type:</span>
                <span class="text-gray-900 font-bold">${typeLabel}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span class="font-semibold text-gray-700">Name:</span>
                <span class="text-gray-900">${name}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span class="font-semibold text-gray-700">Email:</span>
                <span class="text-gray-900">${email}</span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span class="font-semibold text-gray-700">Organization:</span>
                <span class="text-gray-900">${org}</span>
            </div>
            ${dynamicContent}
        `;
    }

    function submitForm() {
        nextBtn.textContent = 'Sending...';

        // Simulate API call
        setTimeout(() => {
            if (window.confetti) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
            successMessage.classList.remove('hidden');
            nextBtn.classList.add('hidden');
            backBtn.classList.add('hidden');

            // Here you would actually handle the form submission to your backend/email service
            // e.g. using fetch to formsubmit.co or your own endpoint
            const formData = {
                _subject: "New CSR Inquiry - Prolithica",
                name: document.getElementById('csr-name').value,
                email: document.getElementById('csr-email').value,
                type: document.querySelector('input[name="csr_type"]:checked').value,
                // ... include other fields
            };
            console.log("Form Data:", formData);

        }, 1500);
    }

    // Handle inline helper links
    window.selectCsrType = function (type) {
        if (type === 'fund') {
            radioButtons[0].checked = true;
            radioButtons[0].dispatchEvent(new Event('change'));
        } else {
            radioButtons[1].checked = true;
            radioButtons[1].dispatchEvent(new Event('change'));
        }
        // Scroll to form logic can be handled by anchor tag default behavior or smooth scroll here
    };
});
