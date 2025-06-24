import Dodopayments from "dodopayments"

const dodo = new Dodopayments({
    bearerToken: process.env.DODOPAYMENTS_API_KEY,
    environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
})
export default dodo
