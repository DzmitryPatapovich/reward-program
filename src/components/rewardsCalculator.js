export default function rewardPointsCalculate (price) {
        let rewards = 0;
        if (price > 100) {
            rewards = (price - 100) * 2;
        }
        if (price > 50) {
            rewards = rewards + (price - 50);
        }
        return rewards;

}