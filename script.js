document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('questionnaireForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successMessage = document.getElementById('successMessage');
    const webhookUrl = 'https://discord.com/api/webhooks/1378395931208060938/PPztSq9dOyPKT6hqdkH7I0JIKgFuEEUaND9Ro58BFkkwMDRrU-RNn4Ofq5zRcUQszykx';

    // Ensure form is visible and success message is hidden on load
    if (form) form.style.display = 'block';
    if (successMessage) successMessage.classList.add('hidden');
    if (loadingOverlay) loadingOverlay.classList.add('hidden');

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading overlay
        loadingOverlay.classList.remove('hidden');
        
        // Collect form data
        const formData = new FormData(form);
        const formEntries = {};
        
        // Process form data
        for (const [key, value] of formData.entries()) {
            // If the key already exists and is an array, add to it
            if (formEntries[key] && Array.isArray(formEntries[key])) {
                formEntries[key].push(value);
            } 
            // If the key already exists but is not an array, convert to array and add
            else if (formEntries[key]) {
                formEntries[key] = [formEntries[key], value];
            } 
            // Otherwise, just set the value
            else {
                formEntries[key] = value;
            }
        }
        
        // Format data for Discord message
        const sections = [
            {
                name: 'Core Website Purpose & Goals',
                fields: ['website_goal', 'website_goal_other', 'usp', 'usp_other']
            },
            {
                name: 'Target Audience & Tour Offerings',
                fields: ['target_audience', 'target_audience_specific', 'age_groups', 'budget_level', 'tour_types', 'tour_types_other', 'itinerary_detail']
            },
            {
                name: 'Essential Website Functionality',
                fields: ['booking_system', 'payment_gateway', 'payment_gateway_name', 'ratings_reviews', 'who_can_review', 'search_filters', 'currency_display', 'multilingual', 'multilingual_languages']
            },
            {
                name: 'Design, Branding & User Experience',
                fields: ['logo_status', 'brand_colors', 'look_and_feel', 'inspirational_sites', 'mobile_experience']
            },
            {
                name: 'Content (Information on the Website)',
                fields: ['content_creation', 'visual_assets', 'blog_section', 'info_pages', 'info_pages_other']
            },
            {
                name: 'Technical & Operational Aspects',
                fields: ['website_platform', 'website_platform_questions', 'hosting_plan', 'content_management', 'technical_maintenance']
            }
        ];
        
        // Create message content
        let messageContent = '**New PriyanshTours.com Questionnaire Response**\n\n';
        
        for (const section of sections) {
            messageContent += `__**${section.name}**__\n\n`;
            
            for (const field of section.fields) {
                const value = formEntries[field];
                if (value && value !== '') {
                    // Format field name for better readability
                    const fieldName = field
                        .replace(/_/g, ' ')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    
                    messageContent += `**${fieldName}**: ${Array.isArray(value) ? value.join(', ') : value}\n`;
                }
            }
            messageContent += '\n';
        }
        
        const payload = {
            content: messageContent,
            username: 'PriyanshTours Form Bot'
        };
        
        try {
            // Send data to Discord webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                // Show success message
                loadingOverlay.classList.add('hidden');
                form.style.display = 'none'; // Hide the form
                successMessage.classList.remove('hidden');
                
                // Auto hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                    form.style.display = 'block'; // Show form again
                    form.reset();
                }, 5000);
            } else {
                throw new Error('Failed to submit form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            loadingOverlay.classList.add('hidden');
            alert('There was a problem submitting your form. Please try again later.');
        }
    });
    
    // Handle "Other" input fields visibility
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // If the radio button has a sibling input field (for "Other" options)
            const parent = this.parentElement;
            const otherInput = parent.querySelector('.other-input');
            
            if (otherInput) {
                if (this.checked && this.value.includes('other') || 
                   (this.name === 'payment_gateway' && this.value === 'yes') ||
                   (this.name === 'multilingual' && this.value === 'essential') ||
                   (this.name === 'website_platform' && this.value === 'questions') ||
                   (this.name === 'target_audience' && this.value === 'specific')) {
                    otherInput.required = true;
                    otherInput.disabled = false;
                    otherInput.style.opacity = '1';
                } else {
                    otherInput.required = false;
                    otherInput.disabled = true;
                    otherInput.value = '';
                    otherInput.style.opacity = '0.5';
                }
            }
        });
    });
    
    // Initialize "Other" input fields to be disabled by default
    document.querySelectorAll('.other-input').forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.5';
    });

    // Handle checkbox for "Other" fields
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const parent = this.parentElement;
            const otherInput = parent.querySelector('.other-input');
            
            if (otherInput && this.value.includes('other')) {
                if (this.checked) {
                    otherInput.disabled = false;
                    otherInput.style.opacity = '1';
                } else {
                    otherInput.disabled = true;
                    otherInput.value = '';
                    otherInput.style.opacity = '0.5';
                }
            }
        });
    });
}); 