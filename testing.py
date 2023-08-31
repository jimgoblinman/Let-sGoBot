import numbers
import random
import requests

url = "https://opentdb.com/api.php?amount=1"

loop = True
while loop:  
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        results = data.get('results', [])  # Get the list of questions
        questions = [question_data.get('question') for question_data in results]
        
        incorrect_answers = [multiple_choice.get('incorrect_answers', []) for multiple_choice in results]
        correct_answer = [answer_data.get('correct_answer') for answer_data in results]

        multiple_choice = []

        print("1. Question: " + questions[0])
        answers = incorrect_answers
        answers[0].append(correct_answer[0])
        print(answers[0])
        random.shuffle(answers[0])

        print(correct_answer[0])
        choice = input("Which one is correct 1-4: ") #1-4
        
        if choice == correct_answer[0]:
            print('Ur correct')
            quit = input("Would you like to continue? (y/n): ")
            if quit == 'n': 
                loop = False
                print('Thanks for playing. See you next time!')
        else:
            print('Ur trash kid! The answer is: ' + correct_answer[0])
            quit = input("Would you like to continue? (y/n): ")
            if quit == 'n': 
                loop = False
                print('Thanks for playing. See you next time!')

else:
    print("Error:", response.status_code)

