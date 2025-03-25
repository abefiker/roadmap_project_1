import prompt from 'prompt-sync'
const input = prompt({ sigint: true })

console.log("Welcome to the Number Guessing Game!")
console.log("I'm thinking of a number between 1 and 100.")

let highScores = { Easy: Infinity, Medium: Infinity, Hard: Infinity }//Track the high score
const playGame = () => {
    console.log("Please Enter the difficulty level: \n1. Easy (10 chances) \n2. Medium (5 chances) \n3. Hard (2 chances)")
    const difficultyLevel = input("Enter your choice: ")
    let level = ''
    let maxAttempts = 0

    if (difficultyLevel === '1') {
        maxAttempts = 10
        level = 'Easy'
    } else if (difficultyLevel === '2') {
        maxAttempts = 5
        level = 'Medium'
    } else if (difficultyLevel === '3') {
        maxAttempts = 2
        level = 'Hard'
    } else {
        console.log("Invalid choice! Defaulting to Medium difficulty (5 chances).")
        maxAttempts = 5
        level = 'Medium'
    }

    console.log(`Great! You have selected the ${level} difficulty level.`)
    // Generate the correct number once
    const correctNumber = Math.floor((Math.random() * 100) + 1)
    let startTime = new Date()
    for (let i = 0; i < maxAttempts; i++) {
        const guess = parseInt(input("Enter your guess: "), 10)
        if (isNaN(guess) || guess < 1 || guess > 100) {
            console.log("Invalid input! Please enter a number between 1 and 100.")
            i-- // Don't count invalid attempts
            continue
        }

        if (guess === correctNumber) {
            let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)
            console.log(`🎉 Congratulations! You guessed the correct number ${correctNumber} in ${i + 1} attempts.`)
            console.log(`⏳ Time taken: ${elapsedTime} seconds.`)

            // Update high score
            if (i + 1 < highScores[level]) {
                highScores[level] = i + 1
                console.log(`🏆 New high score for ${level} difficulty: ${i + 1} attempts!`)
            }

            break
        } else if (guess < correctNumber) {
            console.log(`🔼 Incorrect! The correct number is **greater** than ${guess}.`)
        } else {
            console.log(`🔽 Incorrect! The correct number is **less** than ${guess}.`)
        }
        // Provide a hint if the user has attempted more than half of maxAttempts
        if (i + 1 === Math.ceil(maxAttempts / 2)) {
            if (correctNumber % 2 === 0) {
                console.log("💡 Hint: The correct number is even.")
            } else {
                console.log("💡 Hint: The correct number is odd.")
            }
        }
        if (i === maxAttempts - 1) {
            console.log(`😢 Sorry, you've used all your attempts. The correct number was ${correctNumber}.`)
        }
    }

    console.log("\n🎯 High Scores:")
    console.log(`🟢 Easy: ${highScores.Easy === Infinity ? 'N/A' : highScores.Easy} attempts`)
    console.log(`🟡 Medium: ${highScores.Medium === Infinity ? 'N/A' : highScores.Medium} attempts`)
    console.log(`🔴 Hard: ${highScores.Hard === Infinity ? 'N/A' : highScores.Hard} attempts`)

    let playAgain = input("\nDo you want to play again? (yes/no): ").toLowerCase()
    if (playAgain === 'yes' || playAgain === 'y') {
        console.log("\n🔄 Starting a new game...\n")
        playGame()
    } else {
        console.log("\n👋 Thanks for playing! Goodbye!")
        process.exit(0)
    }
}

playGame()
