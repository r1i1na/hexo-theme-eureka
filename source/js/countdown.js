const CountdownTimer = (() => {
        const config = {
            units: {
                day: { text: "今日", divider: 1, unit: "小时" },
                week: { text: "本周", divider: 24, unit: "天" },
                month: { text: "本月", divider: 24, unit: "天" },
                year: { text: "本年", divider: 24, unit: "天" }
            }
        };
    
        function getTimeUnit(unit) {
            const now = new Date();
            const start = new Date(now.setHours(0, 0, 0, 0));
            const end = new Date(now.setHours(23, 59, 59, 999));
    
            if (unit === 'day') {
                const currentHour = new Date().getHours();
                const remaining = 24 - currentHour;
                const percentage = (currentHour / 24) * 100;
    
                return {
                    name: config.units[unit].text,
                    remaining: remaining,
                    percentage: percentage.toFixed(2),
                    unit: config.units[unit].unit
                };
            }
    
            const ranges = {
                week: () => {
                    start.setDate(start.getDate() - start.getDay());
                    end.setDate(end.getDate() - end.getDay() + 6);
                },
                month: () => {
                    start.setDate(1);
                    end.setMonth(end.getMonth() + 1, 0);
                },
                year: () => {
                    start.setMonth(0, 1);
                    end.setMonth(11, 31);
                }
            };
            ranges[unit]?.();
    
            const total = unit === "day" ? 24 : Math.floor((end - start) / 86400000) + 1;
            const passed = Math.floor((now - start) / (3600000 * config.units[unit].divider));
            const percentage = (passed / total) * 100;
    
            return {
                name: config.units[unit].text,
                remaining: total - passed,
                percentage: percentage.toFixed(2),
                unit: config.units[unit].unit
            };
        }
    
        function updateCountdown() {
            const elements = ['eventName', 'eventDate', 'daysUntil', 'countRight']
                .map(id => document.getElementById(id));
    
            if (elements.some(el => !el)) return;
    
            const [eventName, eventDate, daysUntil, countRight] = elements;
            const timeData = Object.keys(config.units).reduce((acc, unit) => ({ ...acc, [unit]: getTimeUnit(unit) }), {});
            const daysRemaining = Math.round((new Date(eventDate.textContent) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    
            daysUntil.textContent = daysRemaining;
            countRight.innerHTML = Object.entries(timeData)
                .map(([_, item]) => `
                    <div class="cd-count-item">
                        <div class="cd-item-name">${item.name}</div>
                        <div class="cd-item-progress">
                            <div class="cd-progress-bar" style="width: ${item.percentage}%; opacity: ${item.percentage / 100}"></div>
                            <span class="cd-percentage ${item.percentage >= 46 ? 'cd-many' : ''}">${item.percentage}%</span>
                            <span class="cd-remaining ${item.percentage >= 60 ? 'cd-many' : ''}">
                                <span class="cd-tip">还剩</span>${item.remaining}<span class="cd-tip">${item.unit}</span>
                            </span>
                        </div>
                    </div>
                `).join('');
        }
    
        function injectStyles() {
            const styles = `
                .card-countdown .item-content {
                    display: flex;
                }
                .cd-count-left {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    margin-right: 0.8rem;
                    line-height: 1.5;
                    align-items: center;
                    justify-content: center;
                }
                .cd-count-left .cd-text {
                    font-size: 14px;
                }
                .cd-count-left .cd-name {
                    font-weight: bold;
                    font-size: 18px;
                }
                .cd-count-left .cd-time {
                    font-size: 30px;
                    font-weight: bold;
                    color: var(--rin-fontcolor);
                }
                .cd-count-left .cd-date {
                    font-size: 12px;
                    opacity: 0.6;
                }
                .cd-count-left::after {
                    content: "";
                    position: absolute;
                    right: -0.8rem;
                    width: 2px;
                    height: 80%;
                    background-color: var(--rin-fontcolor);
                    opacity: 0.5;
                }
                .cd-count-right {
                    flex: 1;
                    margin-left: .8rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .cd-count-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    height: 24px;
                }
                .cd-item-name {
                    font-size: 14px;
                    margin-right: 0.8rem;
                    white-space: nowrap;
                }
                .cd-item-progress {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    height: 100%;
                    width: 100%;
                    border-radius: 8px;
                    background-color: var(--rin-background);
                    overflow: hidden;
                }
                .cd-progress-bar {
                    height: 100%;
                    border-radius: 8px;
                    background-color: var(--rin-theme);
                }
                .cd-percentage,
                .cd-remaining {
                    position: absolute;
                    font-size: 12px;
                    margin: 0 6px;
                    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                }
                .cd-many {
                    color: var(--rin-fontcolor);
                }
                .cd-remaining {
                    opacity: 0;
                    transform: translateX(10px);
                }
                .card-countdown .item-content:hover .cd-remaining {
                    transform: translateX(0);
                    opacity: 1;
                }
                .card-countdown .item-content:hover .cd-percentage {
                    transform: translateX(-10px);
                    opacity: 0;
                }
            `;
    
            const styleSheet = document.createElement("style");
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    
        let timer;
        const start = () => {
            injectStyles();
            updateCountdown();
            timer = setInterval(updateCountdown, 600000);
        };
    
        ['pjax:complete', 'DOMContentLoaded'].forEach(event => document.addEventListener(event, () => {
            clearInterval(timer);
            start();
        }));
    
        document.addEventListener('pjax:send', () => timer && clearInterval(timer));
    
        return { start, stop: () => timer && clearInterval(timer) };
    })();