#!/usr/bin/env bash
input=$(cat)
model=$(echo "$input" | jq -r '.model.display_name')
used=$(echo "$input" | jq -r '.context_window.used_percentage // 0')
tokens=$(echo "$input" | jq -r '.context_window.total_input_tokens // 0')
tokens_k=$(awk -v t="$tokens" 'BEGIN{printf "%.1f", t/1000}')
five_hour=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // 0')
seven_day=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // 0')

gold='\033[38;5;220m'
gray='\033[38;5;245m'
blue='\033[01;34m'
violet='\033[38;5;135m'
reset='\033[00m'

bracket_content="$model"
if [ -n "$used" ]; then
    bracket_content="$bracket_content | ${gold}${tokens_k}k${reset} ${gray}($(printf '%.0f' "$used")%)${reset}"
fi
if [ -n "$five_hour" ]; then
    bracket_content="$bracket_content | ${blue}5h: $(printf '%.0f' "$five_hour")%${reset}"
fi
if [ -n "$seven_day" ]; then
    bracket_content="$bracket_content | ${violet}7d: $(printf '%.0f' "$seven_day")%${reset}"
fi

printf " ${reset}[%b]" "$bracket_content"
