import numbers
import random
import requests

url = "https://opentdb.com/api.php?amount=2"

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
    else:
        print('Ur trash kid! The answer is: ' + correct_answer[0])
    
    
    #print(answers[0])
    #print(correct_answer[0])

    """
    if incorrect_answers:
        i = 0
        for i in range(3):  # Loop until i equals 3
            if i < len(incorrect_answers[0]):
                print(f"Incorrect Answer {i + 1}: {incorrect_answers[0][i]}")
            else:
                print(f"No incorrect answer at index {i + 1}.")
    """
else:
    print("Error:", response.status_code)

