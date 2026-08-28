//import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

export interface Rubric {
  title: string;
  criteria: RubricCriterion[]; //list of criteria
}
export interface RubricCriterion {
  title: string;
  description: string;
  points: number;
  ratings: RubricRating[]; //list of ratings within each criterion
}
export interface RubricRating {
  title: string;
  description: string;
  points: number;
}
export type RubricVisibility = "hidden" | "always" | "afterSubmit";

interface RubricEditorProps {
  rubric?: Rubric;
  onRubricChange: (r: Rubric) => void;
}

export default function RubricEditor({rubric, onRubricChange}: RubricEditorProps) {
  const r: Rubric = rubric ?? {
    title: "",
    criteria: [
      {title: "",
        description: "",
        points: 0,
        ratings: [
          {title: "Full Credit", description: "Default full score", points: 0},
          {title: "No Credit", description: "Default zero score", points: 0}
        ]
      }
    ]
  };

  function updateRubric(updater: (old: Rubric) => Rubric) {
    const updated = updater(r);
    onRubricChange(updated);
  }

  /* --------------------- criteria functions --------------------- */
  function addCriterion() {
    updateRubric((old) => ({
      ...old,
      criteria: [
        ...old.criteria,
        {
          title: "",
          description: "",
          points: 0,
          ratings: [{
            title: "Full Credit",
            description: "Default full score",
            points: 0 //will be updated when criterion points change
          },
          {
            title: "No Credit",
            description: "Default zero score",
            points: 0
          }
        ]
        }
      ]
    }));
  }
  function removeCriterion(index:number) {
    updateRubric((old) => {
      const criteria = [...old.criteria];
      criteria.splice(index, 1);
      return {...old, criteria};
    });
  }
  function moveCriterion(index:number, direction: "up" | "down") {
    updateRubric((old) => {
      const criteria = [...old.criteria];

      if (direction==="up" && index>0) {
        [criteria[index-1], criteria[index]] = [criteria[index], criteria[index-1]];
      }
      if (direction==="down" && index<criteria.length-1) {
        [criteria[index+1], criteria[index]] = [criteria[index], criteria[index+1]];
      }

      return {...old, criteria};
    });
  }
  function updateCriterionTitle(index: number, title: string) {
    updateRubric((old) => {
      const criteria = [...old.criteria];
      criteria[index] = {...criteria[index], title};
      return {...old, criteria}
    });
  }
  function updateCriterionDescription(index: number, description: string) {
    updateRubric((old) => {
      const criteria = [...old.criteria];
      criteria[index] = {...criteria[index], description};
      return {...old, criteria}
    });
  }
  function updateCriterionPoints(index: number, points: number) {
    updateRubric((old) => {
      const criteria = [...old.criteria];
      const crit = {...criteria[index], points};

      //auto-update full credit point value
      if (crit.ratings.length > 0) {
        crit.ratings[0] = {...crit.ratings[0], points};
      }

      criteria[index] = crit;
      return {...old, criteria};
    });
  }

  /* --------------------- rating functions --------------------- */
  function addRating(ci:number) {
    updateRubric((old) => {
      const criteria = [...old.criteria];
      const crit = {...criteria[ci]};

      crit.ratings = [
        ...crit.ratings,
        {title:"", description:"", points: 0}
      ];

      criteria[ci] = crit;
      return {...old, criteria};
    });
  }
  function updateRating(ci:number, ri: number, field: keyof RubricRating, value: string | number) {
    updateRubric((old) => {
      const criteria = [...old.criteria];
      const crit = {...criteria[ci]};
      const ratings = [...crit.ratings];

      ratings[ri] = {...ratings[ri], [field]: value};
      crit.ratings =  ratings;
      criteria[ci] = crit;

      return {...old, criteria};
    });
  }
  function removeRating(ci: number, ri:number) {
    updateRubric((old) => {
      const criteria = [...old.criteria];
      const crit = {...criteria[ci]};

      const ratings = [...crit.ratings];
      ratings.splice(ri, 1);

      crit.ratings = ratings;
      criteria[ci] = crit;

      return {...old, criteria};
    });
  }
  function moveRating(ci: number, ri: number, direction: "up" | "down") {
    updateRubric((old) => {
      const criteria = [...old.criteria];
      const crit = {...criteria[ci]};
      const ratings = [...crit.ratings];

      if (direction==="up" && ri>0) {
        [ratings[ri-1], ratings[ri]] = [ratings[ri], ratings[ri-1]];
      }
      if (direction==="down" && ri<ratings.length-1) {
        [ratings[ri+1], ratings[ri]] = [ratings[ri], ratings[ri+1]];
      }

      crit.ratings = ratings;
      criteria[ci] = crit;

      return {...old, criteria};
    });
  }

  //total points to update automatically for rubric
  const totalPoints = r.criteria.reduce((sum, c) => sum + c.points, 0);

  /* --------------------- export function - ChatGPT --------------------- */
  function exportCSV() {
    //build header
    let csv = "Criterion Title,Criterion Description,Criterion Points,Rating Title,Rating Description,Rating Points\n";

    r.criteria.forEach((crit) => {
      crit.ratings.forEach((rating) => {
        csv += `"${crit.title.replace(/"/g,'""')}",` +
              `"${crit.description.replace(/"/g,'""')}",` +
              `${crit.points},` +
              `"${rating.title.replace(/"/g,'""')}",` +
              `"${rating.description.replace(/"/g,'""')}",` +
              `${rating.points}\n`;
      });
    });

    //convert to blob and trigger download
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = (r.title.trim() || "rubric") + ".csv"; 
    link.click();

    URL.revokeObjectURL(url);
  }

  //render!
  return (
    <Card className="p-3 mt-3">
      <Card.Body>
        {/* rubric title */}
        <Form.Group>
          <Form.Label><strong>Rubric Title:</strong></Form.Label>
          <Form.Control
            placeholder="Enter Title Here"
            value={r.title}
            onChange={(e) => 
              updateRubric((old) => ({
                ...old,
                title: e.target.value
              }))
            }
          />
        </Form.Group>
        
        <br/>
        <strong>Total Points:</strong> {totalPoints}    

        <table className="table table-bordered mt-3 align-middle">
          <thead className="table-light">
            <tr>
              <th style={{width: "25%"}}>Criteria</th>
              <th style={{width: "70%"}}>Ratings</th>
              <th style={{width: "5%"}}>Points</th>
            </tr>
          </thead>
          <tbody>
            {r.criteria.map((crit, i) => (
              <tr key={i}>
                {/* criteria column */}
                {/* criterion controls */}
                <td className="text-center">
                  <div className="d-flex justify-content-between">
                    <Button
                      size="sm"
                      onClick={() => moveCriterion(i, "up")}
                      disabled={i===0}
                    >↑</Button>
                    <Button
                      size="sm"
                      className="ms-1"
                      onClick={() => moveCriterion(i, "down")}
                      disabled={i===r.criteria.length-1}
                    >↓</Button>
                    <Button
                      size="sm"
                      className="ms-1"
                      variant="danger"
                      onClick={() => removeCriterion(i)}
                    >X</Button>
                  </div>
                  <br/>
                  <Form.Group className="mb-2">
                    <Form.Control
                      placeholder="Criterion Title"
                      value={crit.title}
                      onChange={(e) => updateCriterionTitle(i, e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Description"
                      value={crit.description}
                      onChange={(e) => updateCriterionDescription(i, e.target.value)}
                    />
                  </Form.Group>
                </td>
                {/* ratings column (grid inside cell) */}
                <td>
                  <div className="d-flex flex-row gap-2">
                    {crit.ratings.map((rating, ri) => (
                      <Card key={ri} className="p-2 flex-fill" style={{minWidth: "160px"}}>
                        <div className="d-flex justify-content-between">
                          <Button
                            size="sm"
                            onClick={() => moveRating(i, ri, "up")}
                            disabled={ri===0}
                          >←</Button>
                          <Button
                            size="sm"
                            onClick={() => moveRating(i, ri, "down")}
                            disabled={ri===crit.ratings.length-1}
                          >→</Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => removeRating(i, ri)}
                          >X</Button>
                        </div>

                        <Form.Control
                          className="mt-2"
                          placeholder="Rating Title"
                          value={rating.title}
                          onChange={(e) => updateRating(i, ri, "title", e.target.value)}
                        />
                        <Form.Control
                          className="mt-2"
                          as="textarea"
                          rows={3}
                          //palceholder="Description"
                          value={rating.description}
                          onChange={(e) => updateRating(i, ri, "description", e.target.value)}
                        />
                        <Form.Control
                          className="mt-2"
                          placeholder="points"
                          value={rating.points}
                          onChange={(e) => updateRating(i, ri, "points", Number(e.target.value))}
                        />
                      </Card>
                    ))}

                    <Button
                      size="sm"
                      variant="success"
                      className="h-50 align-self-center"
                      onClick={() => addRating(i)}
                    >Add Rating</Button>
                  </div>
                </td>

                {/* total points for criterion */}
                <td className="text-center">
                  <Form.Control
                    value={crit.points}
                    onChange={(e) => updateCriterionPoints(i, Number(e.target.value))}
                  />
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="d-flex justify-content-between mt-3">
          <Button variant="primary" onClick={exportCSV}>Export Rubric</Button>
          <Button variant="success" onClick={addCriterion}>Add Criterion</Button>
        </div>
        
      </Card.Body>
    </Card>
  )
}