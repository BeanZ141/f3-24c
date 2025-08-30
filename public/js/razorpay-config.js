const RAZORPAY_CONFIG = {
    // Test Key ID - Replace with your actual test key from Razorpay Dashboard
    TEST_KEY_ID: "rzp_test_RARdpJpmGuxtwo",

    // Live Key ID - Use this for production (keep it secure)
    LIVE_KEY_ID: "rzp_live_your_live_key_here",

    // Current environment
    ENVIRONMENT: "test", // 'test' or 'live'

    // Get the appropriate key based on environment
    getKeyId: function () {
        return this.ENVIRONMENT === "test" ? this.TEST_KEY_ID : this.LIVE_KEY_ID;
    },

    // Default options for Razorpay
    getDefaultOptions: function (amount, description, orderId = null) {
        return {
            key: this.getKeyId(),
            amount: amount * 100, // Amount in paise
            currency: "INR",
            name: "Ticketease",
            description: description,
            image: "../images/favicon.png",
            order_id: orderId, // Optional: Generate from backend
            theme: {
                color: "#000000",
            },
            modal: {
                ondismiss: function () {
                    console.log("Payment modal closed by user");
                },
            },
        };
    },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
    module.exports = RAZORPAY_CONFIG;
}

// Make available globally
window.RAZORPAY_CONFIG = RAZORPAY_CONFIG;
