import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, FoodItem, StockAlert, AssociationNeed } from '@core/services/stock-service';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-management.html',
  styleUrls: ['./stock-management.scss']
})
export class StockManagement implements OnInit, AfterViewInit {
  @ViewChild('statsChart') statsChartCanvas!: ElementRef;
  chart: any;
  
  stock: FoodItem[] = [];
  needs: AssociationNeed[] = [];
  statistics: any = {};
  loading = false;
  activeTab: 'inventory' | 'needs' = 'inventory';
  openDropdownId: number | null = null;

  newItem: FoodItem = {
    name: '',
    quantity: 0,
    unit: 'kg',
    category: 'Fruits & Légumes',
    expirationDate: '',
    donorName: '',
    estimatedValue: 0
  };

  newNeed: AssociationNeed = {
    associationName: '',
    category: 'Fruits & Légumes',
    quantityRequested: 0,
    quantitySatisfied: 0,
    priority: 'MEDIUM',
    satisfied: false
  };

  showAddModal = false;
  showAddNeedModal = false;
  showDistributeModal = false;
  selectedItem: FoodItem | null = null;
  distributionData = {
    quantity: 0,
    association: ''
  };

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
  }

  loadData(): void {
    this.loading = true;
    this.stockService.getAllStock().subscribe(data => {
      this.stock = data;
      this.loading = false;
    });
    this.stockService.getStatistics().subscribe(data => {
      this.statistics = data;
      this.createChart();
    });
    this.stockService.getNeeds().subscribe(data => this.needs = data);
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.statsChartCanvas) return;

    const ctx = this.statsChartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Redistribué (Impact)', 'En Stock Actuel'],
        datasets: [{ 
          data: [this.statistics.totalRedistributed || 0, this.stock.reduce((acc, item) => acc + item.quantity, 0)],
          backgroundColor: ['#20c997', '#6f42c1']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Répartition des Flux de Dons' }
        }
      }
    });
  }

  downloadReport(): void {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Rapport d\'Impact Social et Environnemental', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

    // Stats Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Tableau de Bord de Performance', 14, 45);
    
    doc.setFontSize(11);
    const statsY = 55;
    doc.text(`• Total Redistribué: ${this.statistics.totalRedistributed || 0} Unités`, 14, statsY);
    doc.text(`• Économies CO2: ${this.statistics.totalCO2Saved?.toFixed(2) || 0} kg`, 14, statsY + 7);
    doc.text(`• Eau Sauvegardée: ${this.statistics.totalWaterSaved?.toFixed(0) || 0} Litres`, 14, statsY + 14);
    doc.text(`• Valeur Économique: ${this.statistics.totalEconomicValue || 0} €`, 14, statsY + 21);
    doc.text(`• Risques Critiques: ${this.statistics.criticalRiskCount || 0} articles`, 14, statsY + 28);

    // Table
    const tableData = this.stock.map(item => [
      item.name,
      item.category,
      `${item.quantity} ${item.unit}`,
      item.expirationDate,
      item.donorName,
      `${item.estimatedValue} €`
    ]);

    autoTable(doc, {
      head: [['Produit', 'Catégorie', 'Quantité', 'Expiration', 'Donateur', 'Valeur Unit.']],
      body: tableData,
      startY: 100,
      theme: 'striped',
      headStyles: { fillColor: [111, 66, 193] }
    });

    doc.save(`Rapport_Impact_${new Date().toISOString().split('T')[0]}.pdf`);
    Swal.fire('Succès', 'Rapport d\'impact téléchargé.', 'success');
  }

  addFoodItem(): void {
    this.stockService.addFoodItem(this.newItem).subscribe(() => {
      Swal.fire('Succès', 'Nouveau don enregistré avec succès', 'success');
      this.loadData();
      this.showAddModal = false;
      this.resetNewItem();
    });
  }

  addNeed(): void {
    this.stockService.createNeed(this.newNeed).subscribe(() => {
      Swal.fire('Succès', 'Besoin de l\'association enregistré', 'success');
      this.loadData();
      this.showAddNeedModal = false;
      this.newNeed = { associationName: '', category: 'Fruits & Légumes', quantityRequested: 0, quantitySatisfied: 0, priority: 'MEDIUM', satisfied: false };
    });
  }

  openDistributeModal(item: FoodItem, need?: AssociationNeed): void {
    this.selectedItem = item;
    this.distributionData = {
      quantity: need ? Math.min(item.quantity, need.quantityRequested - need.quantitySatisfied) : 0,
      association: need ? need.associationName : ''
    };
    this.showDistributeModal = true;
  }

  distributeFood(): void {
    if (!this.selectedItem || !this.selectedItem.id) return;

    this.stockService.distributeFood({
      foodItemId: this.selectedItem.id,
      quantity: this.distributionData.quantity,
      association: this.distributionData.association
    }).subscribe({
      next: () => {
        Swal.fire('Félicitations !', 'Don redistribué avec succès.', 'success');
        this.loadData();
        this.showDistributeModal = false;
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.message || 'Quantité insuffisante', 'error');
      }
    });
  }

  getMatchingStock(category: string): FoodItem[] {
    return this.stock.filter(item => item.category === category && item.quantity > 0);
  }

  toggleDropdown(id: number | undefined): void {
    if (id === undefined) return;
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  hasStockForCategory(category: string): boolean {
    return this.stock.some(item => item.category === category && item.quantity > 0);
  }

  private resetNewItem(): void {
    this.newItem = {
      name: '',
      quantity: 0,
      unit: 'kg',
      category: 'Fruits & Légumes',
      expirationDate: '',
      donorName: '',
      estimatedValue: 0
    };
  }
}
