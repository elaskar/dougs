Feature: Dougs Synchronization

    Scenario: Synchronize correct datas
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 02-05-2023 | My first movement  | 300.50 |
            | 2  | 07-05-2023 | My second movement | 700.30 |
        And following checkpoints :
            | Date       | Balance |
            | 01-05-2023 | 0       |
            | 08-05-2023 | 1000.80 |
        When I synchronize
        Then I should have success

    Scenario: Synchronize correct datas with duplicate
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 02-05-2023 | My first movement  | 300.50 |
            | 1  | 02-05-2023 | My first movement  | 300.50 |
            | 2  | 07-05-2023 | My second movement | 700.30 |
        And following checkpoints :
            | Date       | Balance |
            | 01-05-2023 | 0       |
            | 08-05-2023 | 1000.80 |
        When I synchronize
        Then I should have success with reason duplicate id 1