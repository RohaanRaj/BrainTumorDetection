document.getElementById('predictButton').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const predictionText = document.getElementById('predictionText');
    const tumorInfo = document.getElementById('tumorInfo');
    const uploadSection = document.getElementById('uploadSection');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    const loading = document.getElementById('loading');
    const background = document.getElementById('background');
    const mainCard = document.getElementById('mainCard');
    const actionCard = document.getElementById('actionCard');
    const file = imageInput.files[0];

    // Reset and show loading
    resultContent.style.display = 'none';
    loading.classList.add('show');
    resultSection.classList.add('show');
    uploadSection.classList.add('hidden');
    background.classList.remove('success', 'danger');
    mainCard.classList.add('show-result');
    actionCard.classList.remove('show');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/predict', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();

            let message = '';
            let info = '';
            let isTumor = false;

            switch (result.prediction) {
                case 'glioma':
                    isTumor = true;
                    message = "Glioma Tumor Detected";
                    info = `
                        <strong>Glioma Tumor Analysis</strong><br><br>
                        Gliomas are brain tumors that vary significantly in aggressiveness.<br><br>
                        <strong>Key Dangers:</strong>
                        <ul>
                            <li><b>Invasive Growth:</b> They often infiltrate healthy brain tissue, making complete removal challenging.</li>
                            <li><b>Rapid Growth:</b> High-grade gliomas can grow quickly, leading to rapid neurological decline.</li>
                            <li><b>Location-Specific Symptoms:</b> Can cause severe headaches, seizures, vision/cognitive problems, and weakness depending on location.</li>
                        </ul>
                        <strong>Immediate Measures/Precautions:</strong>
                        <ul>
                            <li>Seek neuro-oncology consultation immediately.</li>
                            <li>Expect advanced MRI scans and often a biopsy to determine type and grade.</li>
                            <li>Treatment typically involves surgery, radiation therapy, and chemotherapy.</li>
                            <li>Work with your team to manage symptoms like seizures and brain swelling.</li>
                        </ul>
                    `;
                    break;
                case 'meningioma':
                    isTumor = true;
                    message = "Meningioma Tumor Detected";
                    info = `
                        <strong>Meningioma Tumor Analysis</strong><br><br>
                        Meningiomas arise from the brain's protective membranes. Most are benign and slow-growing, but their size and location can cause problems.<br><br>
                        <strong>Key Dangers:</strong>
                        <ul>
                            <li><b>Compression of Brain/Nerves:</b> Even benign tumors can cause symptoms by pressing on the brain, nerves, or blood vessels.</li>
                            <li><b>Location-Specific Risks:</b> Can lead to headaches, seizures, weakness, vision/hearing changes, or memory problems.</li>
                            <li><b>Recurrence:</b> Some can recur even after removal, especially higher-grade ones.</li>
                        </ul>
                        <strong>Immediate Measures/Precautions:</strong>
                        <ul>
                            <li>Consult a neurosurgeon to evaluate the tumor's size, location, and potential for symptoms.</li>
                            <li>Small, asymptomatic tumors may be monitored with regular MRIs.</li>
                            <li>Surgery is often the primary treatment if the tumor is symptomatic or growing.</li>
                            <li>Radiation therapy may be used if surgery isn't fully effective or for higher-grade types.</li>
                            <li>Regular scans are crucial to monitor for recurrence.</li>
                        </ul>
                    `;
                    break;
                case 'pituitary':
                    isTumor = true;
                    message = "Pituitary Tumor Detected";
                    info = `
                        <strong>Pituitary Tumor Analysis</strong><br><br>
                        These tumors develop in the pituitary gland, which controls hormone production. Most are benign.<br><br>
                        <strong>Key Dangers:</strong>
                        <ul>
                            <li><b>Hormonal Imbalance:</b> Many tumors produce excess hormones, leading to various conditions (e.g., hyperthyroidism, Cushing's disease).</li>
                            <li><b>Mass Effect:</b> Larger tumors can press on nearby structures like optic nerves, causing vision problems and headaches.</li>
                            <li><b>Pituitary Insufficiency:</b> A large tumor can disrupt normal pituitary function, leading to hormone deficiencies.</li>
                        </ul>
                        <strong>Immediate Measures/Precautions:</strong>
                        <ul>
                            <li>Consult both an endocrinologist and a neurosurgeon.</li>
                            <li>Extensive blood tests are done to check hormone levels.</li>
                            <li>Treatment may include medication, surgery, and radiation therapy.</li>
                            <li>Regular eye exams are crucial to monitor for vision changes.</li>
                        </ul>
                    `;
                    break;
                case 'notumor':
                    isTumor = false;
                    message = "No Tumor Detected";
                    info = `
                        <strong>Excellent News!</strong><br><br>
                        Your scan shows no signs of a brain tumor. This is a positive result indicating no abnormalities were detected in the analyzed regions.<br><br>
                        <strong>Recommendations:</strong>
                        <ul>
                            <li>Continue with routine medical check-ups</li>
                            <li>Maintain a healthy lifestyle with balanced diet and exercise</li>
                            <li>Discuss any persistent symptoms with your doctor</li>
                            <li>Focus on general wellness (sleep, stress management)</li>
                        </ul>
                    `;
                    break;
                default:
                    message = "Unexpected result. Please try again.";
                    info = '';
            }

            predictionText.textContent = message;
            tumorInfo.innerHTML = info;

            // Change background based on result
            if (result.prediction === 'notumor') {
                background.classList.add('success');
            } else if (isTumor) {
                background.classList.add('danger');
            }

            // Hide loading and show results
            loading.classList.remove('show');
            resultContent.style.display = 'block';
            actionCard.classList.add('show');
        } else {
            const error = await response.json();
            predictionText.textContent = `Error: ${error.detail || response.statusText}`;
            tumorInfo.innerHTML = '';
            loading.classList.remove('show');
            resultContent.style.display = 'block';
            actionCard.classList.add('show');
        }
    } catch (error) {
        predictionText.textContent = `An error occurred: ${error.message}`;
        tumorInfo.innerHTML = '';
        loading.classList.remove('show');
        resultContent.style.display = 'block';
        actionCard.classList.add('show');
    }
});

// File input change handler
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const predictButton = document.getElementById('predictButton');
    
    if (file) {
        document.querySelector('.upload-text').textContent = file.name;
        document.querySelector('.upload-hint').textContent = 'File selected successfully';
        predictButton.disabled = false;
    } else {
        document.querySelector('.upload-text').textContent = 'Click to select MRI image';
        document.querySelector('.upload-hint').textContent = 'Supports JPG, PNG, DICOM formats';
        predictButton.disabled = true;
    }
});

// Function to reset to upload state
function resetToUpload() {
    const uploadSection = document.getElementById('uploadSection');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    const loading = document.getElementById('loading');
    const background = document.getElementById('background');
    const imageInput = document.getElementById('imageInput');
    const predictionText = document.getElementById('predictionText');
    const tumorInfo = document.getElementById('tumorInfo');
    const mainCard = document.getElementById('mainCard');
    const actionCard = document.getElementById('actionCard');
    const predictButton = document.getElementById('predictButton');

    // Reset all elements
    uploadSection.classList.remove('hidden');
    resultSection.classList.remove('show');
    resultContent.style.display = 'none';
    loading.classList.remove('show');
    background.classList.remove('success', 'danger');
    mainCard.classList.remove('show-result');
    actionCard.classList.remove('show');
    
    // Reset form
    imageInput.value = '';
    predictionText.textContent = '';
    tumorInfo.innerHTML = '';
    predictButton.disabled = true;
    
    // Reset upload text
    document.querySelector('.upload-text').textContent = 'Click to select MRI image';
    document.querySelector('.upload-hint').textContent = 'Supports JPG, PNG, DICOM formats';
}