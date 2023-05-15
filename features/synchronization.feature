Feature: Dougs Synchronization

    Scenario: Synchronize correct datas
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 01-05-2023 | My first movement  | 300    |
            | 2  | 07-05-2023 | My second movement | 700    |
        And following checkpoints :
            | Date       | Balance |
            | 01-05-2023 | 300     |
            | 07-05-2023 | 700     |
        When I synchronize
        Then I should have success